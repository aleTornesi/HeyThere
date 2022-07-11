import { MongoClient } from "mongodb"

export default async (collectionName: string) => {
    const client = new MongoClient(process.env.DATABASE_URL!)
    await client.connect()
    return {
        client: client,
        collection: client.db().collection(collectionName)
    }
}