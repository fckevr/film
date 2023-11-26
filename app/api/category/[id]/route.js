import Category from "@models/category";
import { connectToDB } from "@utils/database"

export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        let categories
        if (params.id == "all") {
            categories = await Category.find().lean();
        }
        else {
            categories = await Category.findById(params.id).lean();
        }
        if (categories) {
            return new Response(JSON.stringify(categories), {status: 200})
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
        const category = await Category.findByIdAndRemove(params.id);
        if (category) {
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