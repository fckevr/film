import { connectToDB } from "@utils/database";
import User from "@models/user";
import bcrypt from 'bcrypt';
import { google } from 'googleapis';
import sharp from "sharp";
import fs from 'fs'

const auth = new google.auth.GoogleAuth({
    keyFile: 'utils/sex69-398707-96b75bccc783.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
const drive = google.drive({ version: 'v3', auth });
export const POST = async (request) => {
    let email, username, password, avatar, avatar_id = '';
    const formData = await request.formData();
    email = formData.get("email")
    username = formData.get("username")
    password = formData.get("password")
    avatar = formData.get("avatar")
    try {
        await connectToDB();
        const checkEmail = await User.findOne({
            email: email
        })
        const checkUsername = await User.findOne({
            username: username,
        })
        if (!checkEmail && !checkUsername) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            if (avatar instanceof File) {
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
                    avatar_id = response.data.id
                } 
            }
            
            const user = User.create({
                email: email,
                username: username,
                avatar: avatar_id,
                password: hashPassword,
                role: "user"
            })
            return new Response("Tạo tài khoản thành công!", {status: 200})
        }
        else if (checkEmail && checkUsername) {
            return new Response("Email và tên tài khoản đã được sử dụng!", {status: 500})
        }
        else if (checkEmail && !checkUsername) {
            return new Response("Email đã được sử dụng!", {status: 500})
        }
        else if (!checkEmail && checkUsername) {
            return new Response("Tên tài khoản đã được sử dụng!", {status: 500})
        }
        return new Response(JSON.stringify(user), {status: 200})
    }
    catch (error) {
        console.log(error)
        return new Response("Đã có lỗi xảy ra, vui lòng thử lại!", {status: 500})
    }
}
    