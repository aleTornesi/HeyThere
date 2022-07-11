import firebase from 'firebase/compat/app'
import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../../../firestoreDbConnection";

const handler = async(req: NextApiRequest, res: NextApiResponse) => {
    const db = dbConnection()
    const collection = db.collection('FriendshipRequests')

    switch (req.method) {
        case 'PUT':
            const value: boolean = req.body

            const requestReference = collection.doc(req.query.id as string)//, { $set: { isAccepted: value } })
            const request = (await requestReference.get()).data()

            if (!request) {
                res.status(404).end()
                return
            }

            if (request?.isAccepted == null) {
                requestReference.update({
                    isAccepted: value
                })
                res.status(204).end()
            } else {
                res.status(409).end()
                return
            }

            if (!('groupId' in request!)) {
                const chatDoc = db.collection('Chats').doc()
                chatDoc.set({
                    users: [request.from, request.to],
                    messages: []
                })

                
                const usersCollection = db.collection('Users')

                const fromUserRef = usersCollection.doc(request.from) 
                const fromUserData = (await fromUserRef.get()).data()
                const toUserRef = await usersCollection.doc(request.to) 
                const toUserData = (await toUserRef.get()).data()
                
                fromUserRef.update({
                    contacts: firebase.firestore.FieldValue.arrayUnion({
                        id: request.to,
                        firstName: toUserData!.firstName,
                        lastName: toUserData!.firstName,
                        chatId: chatDoc.id
                    })
                })

                toUserRef.update({
                    contacts: firebase.firestore.FieldValue.arrayUnion({
                        id: request.from,
                        firstName: fromUserData!.firstName,
                        lastName: fromUserData!.firstName,
                        chatId: chatDoc.id
                    })
                })
            }
            break;
        default:
            res.status(501).end()
            break;
    }

}

export default handler