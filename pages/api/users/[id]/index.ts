import { Collection } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnection from "../../../../firestoreDbConnection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const db = dbConnection()
    const collection = db.collection('Users')

    const { id } = req.query

    const userSnapshot = await collection.doc(id as string).get()
    const user = userSnapshot.data()

    if (!user) {
        res.status(404)
        return
    }

    res.json(user)
}

export default handler