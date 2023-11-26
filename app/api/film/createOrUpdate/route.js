import Film from '@models/film';
import { connectToDB } from '@utils/database';
import slugify from 'slugify'
import sharp from "sharp";
import fs from 'fs'

export const POST = async (req) => {
    let film = {
        id: '',
        name: '',
        code: '',
        slug: '',
        actors: [],
        producers: [],
        categories: [],
        showTag: '',
        tags: [],
        description: '',
        links: [],
        thumbnail: '',
        like: 0,
        dislike: 0,
        view: 0
    }

    const formData = await req.formData();
    film.id = formData.get("id")
    film.name = formData.get("name")   
    film.code = formData.get("code")
    film.actors = formData.getAll("actor[]")
    film.categories = formData.getAll("category[]")
    film.producers = formData.getAll("producer[]")
    film.showTag = formData.get("showtag")
    film.tags = formData.getAll("tags[]")
    film.thumbnail = formData.get("thumbnail_id")
    film.links = formData.getAll("links[]")
    film.description = formData.get("description")
    film.like = formData.get("like")
    film.dislike = formData.get("dislike")
    film.view = formData.get("view")
    const thumbnail = formData.get("thumbnail_file")
    film.slug = slugify(film.name, {
        locale: 'vi',
        lower: true
    })

    try {
        await connectToDB();
        if (thumbnail instanceof File) {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${thumbnail.name}`;
            /* convert file to buffer */
            const stream = thumbnail.stream();
            const chunks = [];
            for await (const chunk of stream) {
            chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            const compressedImageBuffer = await sharp(buffer).resize({ width: 1280, height: 720, fit: 'inside' }).toFormat('jpeg').toBuffer();
            if (film.thumbnail != '') {
                try {
                    fs.unlinkSync("public/assets/thumbnail/" + film.thumbnail)
                }
                catch (error) {
                    return new Response(error, {status: 500})
                }
            }
            const tempFilePath = 'public/assets/thumbnail/' + fileName;
            fs.writeFileSync(tempFilePath, compressedImageBuffer);
            film.thumbnail = fileName
        }
        if (film.id != '') {
            const filter = {_id: film.id}
            const update = {
                $set: {
                    name: film.name,
                    code: film.code,
                    slug: film.slug,
                    showtag: film.showTag,
                    link: film.links,
                    description: film.description,
                    thumbnail: film.thumbnail,
                    actor: film.actors,
                    category: film.categories,
                    producer: film.producers,
                    tags: film.tags,
                    like: film.like,
                    dislike: film.dislike,
                    view: film.view
                }
            }
            const updatedFilm = await Film.findOneAndUpdate(filter, update, {new: true})
            if (updatedFilm) {
                return new Response("OK", {status: 200})
            }
            else {
                return new Response("Không tìm thấy phim", {status: 500})
            }

            // const existFilm = await Film.findByIdAndUpdate(film.id, film)
            // console.log(existFilm)
            // if (existFilm) {
            //     return new Response("OK", {status: 200})
            // }
            // else {
            //     return new Response("Không tìm thấy phim", {status: 500})
            // }
        }
        else {
            const newFilm = await Film.create({
                name: film.name,
                slug: film.slug,
                code: film.code,
                actor: film.actors,
                producer: film.producers,
                category: film.categories,
                showtag: film.showTag,
                tags: film.tags,
                link: film.links,
                description: film.description,
                thumbnail: film.thumbnail,
            })
            if (newFilm) {
                return new Response("OK", {status: 200})
            }
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}