import Conversation from "@models/conversation";
import Message from "@models/message";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        const conversations = await Conversation.find({$or: [{type: 'all'}, {members: params.id}]}).populate({
            path: 'members',
            model: User,
            select: "_id username avatar"
        })

        const newConversations = await Promise.all(
            conversations.map(async (c) => {
                const unseen = await Message.countDocuments({
                    $and: [
                        { conversation: c._id },
                        { seen: false },
                        { sender: { $ne: params.id } },
                    ],
                });
                const lastMessage = await Message.find({ conversation: c._id })
                    .populate({
                        path: "sender",
                        model: User,
                        select: "_id username avatar", // select only _id, username, and avatar fields
                    })
                    .sort({ date: "desc" })
                    .limit(1);
                return {
                    ...c.toObject(),
                    unseen: unseen,
                    lastMessage: lastMessage[0],
                };
            })
        );

        if (conversations) {
            return new Response(JSON.stringify(newConversations), { status: 200 });
        } else {
            return new Response("Lỗi", { status: 500 });
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}

