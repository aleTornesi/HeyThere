import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../../../firestoreDbConnection";

const handler = async(req: NextApiRequest, res: NextApiResponse) => {
    //const {client, collection} = await dbConnection('Users')
    const db = dbConnection()
    const collection = db.collection('Users')
    switch (req.method) {
        case 'GET':
            const userSnapshot = await collection.doc(req.query.id as string).get()
            const user = userSnapshot.data()

            if (!user) {
                res.status(404)
                return
            }
            res.json(user.contacts)
            break;
        default:
            break;
    }
}

export default handler