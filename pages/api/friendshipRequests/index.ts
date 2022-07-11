import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../../firestoreDbConnection";

export default withApiAuthRequired(async(req: NextApiRequest, res: NextApiResponse) => {
    const session = getSession(req, res)
    console.log('connected to db')
    const db = dbConnection()
    const usersCollection = db.collection('FriendshipRequests')
    switch (req.method) {
        case 'GET':
            let requestsQuery: firebase.firestore.Query | null
            if ('to' in req.query) {
                if (req.query.to != session!.user.sub) {
                    res.status(401)
                    return
                }

                requestsQuery = usersCollection.where('to', '==', session!.user.sub)

                if ('isAccepted' in req.query) {
                    if(req.query.isAccepted == 'null')
                        requestsQuery = requestsQuery.where('isAccepted', '==', null)
                    else
                        requestsQuery = requestsQuery.where('isAccepted', '==', req.query.isAccepted)//({to: session!.user.sub, isAccepted: req.query.isAccepted}).toArray()
                }

            }
            else
                requestsQuery = null
            
            const requestsSnapshot = await (requestsQuery?.get() ?? usersCollection.get())
            const requests = requestsSnapshot.docs.map(doc => doc.data())
            res.json(requests)
            break;
        case "POST":
            if (req.body.users?.length == 0) {
                res.status(400).send("You have to send at least one user.")
                return
            }

            const chatsCollection = db.collection('Chats')
            const friendshipRequestsCollection = db.collection('FriendshipRequests')

            const usersIds: string[] = req.body.users
            const isGroup: boolean = req.body.isGroup

            const usersDocumentsSnapshot = await usersCollection.where(firebase.firestore.FieldPath.documentId(), 'in', usersIds).get()
            const usersDocuments = await usersDocumentsSnapshot.docs.map(doc => doc.data())

            const authenticatedUserSnapshot = await usersCollection.doc(session?.user.sub).get()
            const authenticatedUser = authenticatedUserSnapshot.data()
            
            if (usersDocuments.length != usersIds.length) {
                res.status(404).send("This user does not exist.")
                return
            }

            
            if (isGroup) {
                const createdChatDocument = chatsCollection.doc()
                createdChatDocument.set({
                    name: req.body.name,
                    isGroup: true,
                    users: [session!.user.sub]
                })
                
                usersIds.forEach(async (id: string) => {
                    friendshipRequestsCollection.doc().set({
                        from: session!.user.sub,
                        to: id,
                        groupId: createdChatDocument.id,
                        groupName: req.body.name,
                        isAccepted: null
                    })
                })
                res.setHeader('Location', `http://localhost:3000/api/chats/${createdChatDocument.id}`)
            }
            else {
                const chatSnapshot = await chatsCollection.where('users', 'array-contains', [usersIds[0], session!.user.sub]).where('users-number', '==', 2).get()
    
                if (chatSnapshot.size > 0) {
                    res.status(409).send("This request has already been created.")
                    return
                }


                let createdFriendshipRequestDocument = await friendshipRequestsCollection.doc()

                createdFriendshipRequestDocument.set({
                    from: session!.user.sub,
                    fromName: `${authenticatedUser!.firstName} ${authenticatedUser!.lastName}`,
                    to: usersIds[0],
                    toName: `${usersDocuments[0].firstName} ${usersDocuments[0].lastName}`,
                    isAccepted: null
                })

                res.setHeader('Location', `http://localhost:3000/api/friendshipRequests/${createdFriendshipRequestDocument.id}`)
            }

            res.status(201).end()
            break;
        default:
            res.status(501).end()
            break;
    }
})