import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";
const ConversationSchema = new Schema({
    members: [{
        type: ObjectId,
        ref: 'User'
    }],
    type: {
        type: String,
        required: [true, 'Loại chat'],
    },
    unlocked: [{
        type: ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
})

const Conversation = models.Conversation || model("Conversation", ConversationSchema)

export default Conversation;