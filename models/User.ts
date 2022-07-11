import { Schema, model, models } from 'mongoose'

export default models.Users || model('User', new Schema({
    _id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contacts: {
        type: Array,
        required: true
    },
    img: {
        type: String,
        required: false
    }
}), "Users")