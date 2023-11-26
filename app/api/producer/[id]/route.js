import Producer from "@models/producer";
import { connectToDB } from "@utils/database"

export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        let producers
        if (params.id == "all") {
            producers = await Producer.find().lean();
        }
        else {
            producers = await Producer.findById(params.id).lean();
        }
        if (producers) {
            return new Response(JSON.stringify(producers), {status: 200})
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
        const producer = await Producer.findByIdAndRemove(params.id);
        if (producer) {
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