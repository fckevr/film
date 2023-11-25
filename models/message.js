import { ObjectId } from "mongodb";
import { Schema, model, models, now } from "mongoose";
const MessageSchema = new Schema({
    conversation: {
        type: ObjectId,
        required: [true, 'Id trò chuyện bắt buộc'],
        ref: "Conversation"
    },
    sender: {
        type: ObjectId,
        required: [true, 'Người gửi bắt buộc'],
        ref: 'User'
    },
    type: {
        type: String,
        required: [true, "Loại tin nhắn bắt buộc"],
    },
    message: {
        type: String,
        required: [true, "Tin nhắn bắt buộc"]
    }, 
    seen: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: now
    }
})

const Message = models.Message || model("Message", MessageSchema)

export default Message;