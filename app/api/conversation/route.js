import Conversation from "@models/conversation";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
    const conversation = await req.json()
    try {
        await connectToDB();
        const currentConversation = await Conversation.findById(conversation.id)
        currentConversation.unlocked = [...currentConversation.unlocked, conversation.unlock_id]
        const updateConversation = await Conversation.findByIdAndUpdate(conversation.id, currentConversation)
        const user = await User.findById(conversation.user_id)
        if (conversation.unlock_for == "me") {
            user.balance = Number(user.balance) - Number(1)
        }
        else {
            user.balance = Number(user.balance) - Number(1.5)
        }
        const updateUser = await User.findByIdAndUpdate(user._id, user)
        if (updateConversation && updateUser) {
            return new Response("OK", { status: 200 });
        } else {
            return new Response("Lỗi", { status: 500 });
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}