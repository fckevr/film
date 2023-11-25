import Actor from '@models/actor';
import { connectToDB } from '@utils/database';
import slugify from 'slugify'
import { google } from 'googleapis';
import sharp from "sharp";
import fs from 'fs'

const auth = new google.auth.GoogleAuth({
    keyFile: 'utils/sex69-398707-96b75bccc783.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
const drive = google.drive({ version: 'v3', auth });
export const POST = async (req) => {
    let actor = {
        id: '',
        name: '',
        info: '',
        slug: '',
        avatar: ''
    }
    const formData = await req.formData();
    actor.id = formData.get("id")
    actor.name = formData.get("name")   
    actor.info = formData.get("info")
    actor.avatar = formData.get("avatar_id")
    const avatar = formData.get("avatar")
    actor.slug = slugify(actor.name, {
        locale: 'vi',
        lower: true
    })
    try {
        await connectToDB();
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
            if (actor.avatar != '') {
                try {
                    const deleted = await drive.files.delete({
                        fileId: actor.avatar
                    })
                }
                catch (error) {
                    return new Response(error, {status: 500})
                }
            }
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: 'image/jpeg',
                    parents: ['1ElvJyKFHJJMwogoZliPRoouKdm-XKrGM']
                },
                media: {
                    mimeType: 'image/jpeg',
                    body: fs.createReadStream(tempFilePath),
                },
            });
            if (response) {
                actor.avatar = response.data.id
            } 
        }
        if (actor.id != '') {
            const existActor = await Actor.findByIdAndUpdate(actor.id, actor)
            if (existActor) {
                return new Response("OK", {status: 200})
            }
            else {
                return new Response("Không tìm thấy diễn viên", {status: 500})
            }
        }
        else {
            const newActor = await Actor.create({
                name: actor.name,
                slug: actor.slug,
                info: actor.info,
                avatar: actor.avatar
            })
            if (newActor) {
                return new Response("OK", {status: 200})
            }
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}