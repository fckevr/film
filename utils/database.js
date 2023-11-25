import Conversation from "@models/conversation";
import mongoose from "mongoose";

let isConnected = false;

const createAllConversation = async () => {

    const count = await Conversation.countDocuments()

    if (count <= 0) {
        const conversationAll = {
            type: 'all'
        }
        Conversation.create(conversationAll)
    }
}

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "sex69",
            useNewUrlParser: true,
            useUnifiedTopology: true    
        })

        isConnected = true
        await createAllConversation()
    } catch (error) {
        console.log(error)
    }
}
