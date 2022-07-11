import { ObjectId } from "mongodb"

export interface IMessage {
    readonly _id?: ObjectId,
    readonly sender: string,
    readonly content: string,
    readonly dateTime: Date
}

export default interface IChat {
    readonly _id?: ObjectId,
    readonly users: string[],
    readonly messages: IMessage[]
}