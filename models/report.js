import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";
const ReportSchema = new Schema({
    film: {
        type: ObjectId,
        ref: 'Film'
    },
    status: {
        type: String
    }
}, {
    timestamps: true
})

const Report = models.Report || model("Report", ReportSchema)

export default Report;