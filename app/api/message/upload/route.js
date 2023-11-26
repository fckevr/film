import Message from "@models/message";
import User from "@models/user";
import { connectToDB } from "@utils/database";
import sharp from "sharp";
import fs from 'fs'
export const POST = async (request) => {
    const data = await request.formData()
    const conversation = data.get('conversation')
    const sender = data.get('sender')
    const file = data.get('image')
    try {
        await connectToDB();

        if (file instanceof File) {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.name}`;
            /* convert file to buffer */
            const stream = file.stream();
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            const compressedImageBuffer = await sharp(buffer)
                .resize({ width: 1280, height: 720, fit: 'inside' })
                .toFormat('jpeg')
                .toBuffer();
            const tempFilePath = 'public/assets/messages/' + fileName;
            fs.writeFileSync(tempFilePath, compressedImageBuffer);

            var now = new Date();
            await Message.updateMany(
                { $and: [{ conversation: conversation }, { sender: { $ne: sender } }] },
                { seen: true }
            );
            const message = await Message.create({
                conversation: conversation,
                sender: sender,
                type: "image",
                message: fileName,
                date: now
            })
           
            const senderUser = await User.findById(sender, '_id username avatar')
            message.sender = senderUser
            return new Response(JSON.stringify(message), {status: 200})
        }
    }
    catch (error) {
        return new Response("Đã có lỗi xảy ra, vui lòng thử lại!", {status: 500})
    }
}