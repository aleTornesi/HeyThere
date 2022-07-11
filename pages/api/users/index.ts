import { getSession } from "@auth0/nextjs-auth0";
import { Collection, MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../../firestoreDbConnection";
import { IFriendshipRequest } from "../../../interfaces/IFriendShipRequest";
import IUser, { IContact } from "../../../interfaces/IUser";
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { collection, doc, DocumentData, getDoc, getDocs, query, where } from "firebase/firestore";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const db = dbConnection()
    const usersCollection = collection(db, 'Users')
    switch (req.method) {
        case 'GET':
            const session = getSession(req, res)
            let users: DocumentData[]
            if (session && 'notContacts' in req.query) {
                const friendshipRequestsCollection = collection(db, 'FriendshipRequests')
                const userSnapshot = await getDoc(doc(usersCollection, session.user.sub))
                const user = userSnapshot.data()

                const contacts: string[] = []

                user!.contacts.forEach((contact: IContact) => {
                    contacts.push(contact._id)
                })

                const userFriendshipRequestsSnapshot = await getDocs(
                    query(
                        friendshipRequestsCollection,
                        where('from', '==', session.user.sub)
                    )
                )
                userFriendshipRequestsSnapshot.forEach((request) => {
                    contacts.push(request.data().from)
                })

                const usersSnapshot = await getDocs(
                    query(
                        usersCollection,
                        where(firebase.firestore.FieldPath.documentId(), 'in', [...contacts, userSnapshot.id])
                    )
                )
                users = usersSnapshot.docs.map(doc => doc.data())
            }
            else {
                const usersSnapshot = await getDocs(usersCollection)
                users = usersSnapshot.docs.map(doc => doc.data())
            }
            res.json(users)
            break;
        default:
            res.status(501)
            break;
    }
}

export default handler