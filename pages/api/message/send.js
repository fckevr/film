import Conversation from "@models/conversation";
import Message from "@models/message";
import User from "@models/user";
import { connectToDB } from "@utils/database";
const SendMessage = async (request, response) => {
    const data = JSON.parse(request.body)
    try {
        await connectToDB();

        if (data.conversation != "") {
            var now = new Date()
            await Message.updateMany({$and: [{conversation: data.conversation}, {sender: {$ne: data.sender}}]}, {seen: true})
            const message = await Message.create({
                conversation: data.conversation,
                sender: data.sender,
                type: "text",
                message: data.message,
                date: now
            })
            const senderUser = await User.findById(data.sender, '_id username avatar')
            message.sender = senderUser
            response?.socket?.server?.io?.to(data.conversation).emit('message', JSON.stringify(message))  
        }

        else {
            const members = [data.sender, data.receiver]
            const conversation = await Conversation.create({
                members: members,
                type: 'p2p'
            })
            var now = new Date()
  
            const message = await Message.create({
                conversation: conversation._id,
                sender: data.sender,
                type: "text",
                message: data.message,
                date: now
            })
            response?.socket?.server?.io?.to(data.receiver).emit('new-conversation', "new conversation")  
        }  
        response.status(200).json("Done")
    }
    catch (error) {
        console.log(error)
        response.status(500).json("Đã có lỗi xảy ra, vui lòng thử lại!")
    }
}

export default SendMessage

