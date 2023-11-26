import Film from "@models/film";
import Report from "@models/report";
import { connectToDB } from "@utils/database"

export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        let reports
        if (params.id == "all") {
            reports = await Report.find().sort({createdAt: 'desc', status: "asc"}).populate({
                path: 'film',
                model: Film
            }).lean();
        }
        else if (params.id == "not") {
            reports = (await Report.find({status: "0"}).sort({createdAt: 'desc'})).length
        }
        else {
            reports = await Report.findById(params.id).populate({
                path: 'film',
                model: Film
            }).lean();
        }
        if (reports) {
            return new Response(JSON.stringify(reports), {status: 200})
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
        const report = await Report.findByIdAndRemove(params.id);
        if (report) {
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