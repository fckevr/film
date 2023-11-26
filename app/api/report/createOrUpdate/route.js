import Report from '@models/report';
import { connectToDB } from '@utils/database';
export const POST = async (req) => {
    const report = await req.formData();
    try {
        await connectToDB();
        if (report.get("id")) {
            const existReport = await Report.findByIdAndUpdate(report.get("id"), {
                film: report.get("film"),
                status: report.get("status")
            })
            if (existReport) {
                return new Response("OK", {status: 200})
            }
            else {
                return new Response("Không tìm thấy báo cáo", {status: 500})
            }
        }
        else {
            const existReport = await Report.find({film: report.get("film"), status: {$in: ["0","1"]}})
            if (existReport.length > 0) {
                return new Response("OK", {status: 200})
            }
            else {
                const newReport = await Report.create({
                    film: report.get("film"),
                    status: report.get("status")
                })
                if (newReport) {
                    return new Response("OK", {status: 200})
                }
            }     
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}