import { ObjectId } from "mongodb";

export interface IFriendshipRequest {
    _id: ObjectId,
    from: string,
    fromName: string,
    to: string,
    toName: string,
    groupId?: string,
    groupName?: string,
    isAccepted: boolean
}
