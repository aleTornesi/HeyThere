interface IUserData {
    readonly _id: string,
    readonly firstName: string,
    readonly lastName: string,
    img?: string
}

export interface IContact extends IUserData {
    lastMessage?: {
        content: string,
        dateTime: Date
    }
}

export default interface IUser extends IUserData {
    contacts: IContact[]
}

