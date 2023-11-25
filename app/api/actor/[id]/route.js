import Actor from "@models/actor";
import { connectToDB } from "@utils/database"
import { google } from 'googleapis';
const auth = new google.auth.GoogleAuth({
    keyFile: 'utils/sex69-398707-96b75bccc783.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
const drive = google.drive({ version: 'v3', auth });
export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        let actors
        if (params.id == "all") {
            actors = await Actor.find().sort({name: "asc"});
        }
        else {
            actors = await Actor.find({slug: params.id})
            if (actors.length == 0) {
                actors = await Actor.findById(params.id);
            }
        }
        if (actors) {
            return new Response(JSON.stringify(actors), {status: 200})
        }
        else {
            return new Response("Lỗi", {status: 500})
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}

export const DELETE = async(request, {params}) => {
    try {
        await connectToDB();
        const actor = await Actor.findById(params.id)
        const deleted = await drive.files.delete({
            fileId: actor.avatar
        })
        const response = await Actor.findByIdAndRemove(params.id);
        if (response) {
            return new Response("Deleted", {status: 200})
        }
        else {
            return new Response("khong co id ma oi", {status: 500})
        }

    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}