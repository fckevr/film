import User from "@models/user";
import { connectToDB } from '@utils/database';
import bcrypt from 'bcrypt';
import { google } from 'googleapis';
import sharp from "sharp";
import fs from 'fs'

const auth = new google.auth.GoogleAuth({
    keyFile: 'utils/sex69-398707-96b75bccc783.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
const drive = google.drive({ version: 'v3', auth });

export const POST = async (req) => {
    const formData = await req.formData();
    const id = formData.get("id")
    const avatar = formData.get("avatar")
    try {
        await connectToDB();
        const existUser = await User.findById(id)
        if (formData.getAll("saved[]")) {
            existUser.saved = formData.getAll("saved[]")
        }
        if (formData.get("password")) {
            const newPassword = formData.get("newPassword")
            const match = await bcrypt.compare(formData.get("password"), existUser.password)
            if (match) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                existUser.password = hashedPassword
            }
            else {
                return new Response("Current Password is not valid!", {status: 500})
            
            }
        }
        if (formData.get("avatar") instanceof File) {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${avatar.name}`;
            /* convert file to buffer */
            const stream = avatar.stream();
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            const compressedImageBuffer = await sharp(buffer).resize({width: 800, height: 800, fit: 'inside'}).toFormat('jpeg').toBuffer();
            const tempFilePath = 'temp-compressed-image.jpg';
            fs.writeFileSync(tempFilePath, compressedImageBuffer);
            // xóa ảnh hiện tại
            try {
                const deleted = await drive.files.delete({
                    fileId: existUser.avatar
                })
            }
            catch (error) {
                return new Response(error, {status: 500})
            }
    
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: 'image/jpeg',
                    parents: ['10ZMlOG_xLZwPJyb05VZWLIbVmtQVS_F5']
                },
                media: {
                    mimeType: 'image/jpeg',
                    body: fs.createReadStream(tempFilePath),
                },
            });
            if (response) {
                existUser.avatar = response.data.id
            } 
        }
        if (existUser.id != '') {
            const updated = await User.findByIdAndUpdate(existUser.id, existUser, {new: true})
            if (updated) {
                return new Response(updated.avatar, {status: 200})
            }
            else {
                return new Response("Không tìm thấy NSX", {status: 500})
            }
        }

    }
    catch (error) {
        console.log(error)
        return new Response(error, {status: 500})
    }
}