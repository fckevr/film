import Actor from "@models/actor";
import Category from "@models/category";
import Film from "@models/film";
import Producer from "@models/producer";
import { connectToDB } from "@utils/database"
import fs from 'fs'
export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        let films
        if (params.id == "all") {
            films = await Film.find().populate({
                path: 'actor',
                model: Actor
            }).sort({createdAt: 'desc'}).lean();
        }
        else if (params.id == "newest") {
            films = await Film.find().sort({createdAt: 'desc'}).limit(6).lean()
        }
        else if (params.id == "europe") {
            films = await Film.find({showtag: "europe"}).limit(6).lean()
        }
        else if (params.id == "asia") {
            films = await Film.find({showtag: "asia"}).limit(6).lean()
        }
        else if (params.id == "views") {
            films = await Film.find().sort({view: 'desc'}).limit(8).lean()
        }
        else if (params.id.includes("-")) {
            const film_cur = await Film.findOne({slug: params.id})
            const filter = {_id: film_cur.id}
            const update = {
                $set: {
                    view: film_cur.view + 1
                }
            }
            await Film.findOneAndUpdate(filter, update)
            films = await Film.findOne({slug: params.id}).populate({
                path: 'actor',
                model: Actor
            }).populate({
                path: 'category',
                model: Category
            }).populate({
                path: 'producer',
                model: Producer
            }).lean()
        }
        else if (params.id == "random") {
            films = await Film.aggregate([{ $sample: {size: 8}}])
        }
        else if (params.id == "search") {
            const url = new URL(request.url)
            const keyword = url.searchParams.get('keyword')
            const actor = url.searchParams.get('actor')
            const category = url.searchParams.get('category')
            const producer = url.searchParams.get('producer')
            if (actor) {
                const actorFound = await Actor.findOne({slug: actor})
                films = await Film.find({actor: actorFound._id}).lean()
            }
            else if (category) {
                const categoryFound = await Category.findOne({slug: category})
                films = await Film.find({category: categoryFound._id}).lean()
            }
            else if (producer) {
                const producerFound = await Producer.findOne({slug: producer})
                films = await Film.find({producer: producerFound._id}).lean()
            }
            else {
                let actorId = null
                let categoryId = null
                let producerId = null
                const actorFound = await Actor.findOne({$or: [{name: {$regex: keyword, $options: 'i'}}, {slug: {$regex: keyword, $options: 'i'}}]})
                const categoryFound = await Category.findOne({$or: [{name: {$regex: keyword, $options: 'i'}}, {slug: {$regex: keyword, $options: 'i'}}]})
                const producerFound = await Producer.findOne({$or: [{name: {$regex: keyword, $options: 'i'}}, {slug: {$regex: keyword, $options: 'i'}}]})
                if (actorFound) {
                    actorId = actorFound._id
                }
                if (categoryFound) {
                    categoryId = categoryFound._id
                }
                if (producerFound) {
                    producerId = producerFound._id
                }
                films = await Film.find({$or: [{code: {$regex: keyword, $options: 'i'}}, {name: {$regex: keyword, $options: 'i'}}, {showtag: {$regex: keyword, $options: 'i'}}, 
                        {tags: {$regex: keyword, $options: 'i'}}, {actor: actorId}, {producer: producerId}, {category: categoryId}]}).lean()
            } 
        }
        else {
            films = await Film.findById(params.id).populate({
                path: 'actor',
                model: Actor
            }).populate({
                path: 'category',
                model: Category
            }).populate({
                path: 'producer',
                model: Producer
            }).lean()
        }
        if (films) {
            return new Response(JSON.stringify(films), {status: 200})
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
        const film = await Film.findById(params.id)
        fs.unlinkSync("public/assets/thumbnail/" + film.thumbnail)
        const response = await Film.findByIdAndRemove(params.id);
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