import {getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import firebase from 'firebase/compat/app'
import { NextApiRequest } from "next";
import {Server as SocketIOServer} from 'socket.io'
import {sign as jwtSign, verify as jwtVerify} from 'jsonwebtoken'
import { IMessage } from "../../../interfaces/IMessage";
import dbConnection from "../../../firestoreDbConnection";

export default withApiAuthRequired(async (req: NextApiRequest, res: any) => {
    var session = getSession(req, res)
    if (!session) {
        res.send('Authentication error')
        return
    }

    const token = jwtSign(session.user.sub, process.env.PRIVATE_KEY!)
    res.send(token)
    if (res.socket?.server.io) return

    setUpWS();

    async function setUpWS() {

        const io = new SocketIOServer(res.socket.server);
    
        const db = dbConnection();
        const chatsCollection = db.collection('Chats');
        const usersCollection = db.collection('Users');

        io.on('connection', async (socket) => {
            //grab data needed for the communication
            const token: string = socket.handshake.auth.token;
            const chatId: string = socket.handshake.query.chatId as string;


            //if the token of the id of the contact are not provided we disconnect
            if (!token || !chatId) {
                socket.disconnect(true);
                return;
            }

            const verifiedToken: string = jwtVerify(token, process.env.PRIVATE_KEY!) as string; //the token always contains a string

            if (!verifiedToken) {
                socket.disconnect(true);
                return;
            }

            //the $all operator accepts all the documents which have in the field at least those values in whatever order
            const chatRef = chatsCollection.doc(chatId)
            const chatSnapshot = await chatRef.get()

            //if there's no chat with those users we disconnect
            if (!chatSnapshot.exists) {
                socket.disconnect();
                return;
            }

            const chatData = chatSnapshot.data()

            socket.emit('initialMessages', JSON.stringify(chatData));

            socket.join(chatId);

            socket.on('send-message', async(message: string) => {
                socket.to(chatId).emit('message', message)

                const messageObj: IMessage = {
                    sender: verifiedToken,
                    content: message,
                    dateTime: new Date()
                };
                chatRef.update({
                    messages: firebase.firestore.FieldValue.arrayUnion(messageObj)
                })

                const chatUsers = await usersCollection
                    .where(firebase.firestore.FieldPath.documentId(), 'in', chatData!.users)
                    .get()
                
                chatUsers.docs.map(doc => {
                    doc.ref.update({
                        lastMessage: {
                            content: message,
                            dateTime: new Date()
                        }
                    })
                })

                socket.emit('message-sent', message);
            });
        });

        res.socket.server.io = io;
    }
})