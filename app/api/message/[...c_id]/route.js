import Message from "@models/message";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        let messages
        if (params.c_id[1] == 0) {
            messages = await Message.find({conversation: params.c_id[0]}).sort({date: -1}).limit(50).populate({
                path: 'sender',
                model: User, 
                select: "_id username avatar"
            }).lean()
        }

        else {
            const startIndex = params.c_id[1] * 50
            messages = await Message.find({conversation: params.c_id[0]}).populate({
                path: 'sender',
                model: User, 
                select: "_id username avatar"
            }).sort({date: -1}).skip(startIndex).limit(10).lean()
        }
        if (messages) {
            messages = messages.reverse()
            return new Response(JSON.stringify(messages), {status: 200})
        }
        else {
            return new Response("Lỗi", {status: 500})
        }
    }
    catch (error) {
        console.log(error)
        return new Response(error, {status: 500})
    }
}
