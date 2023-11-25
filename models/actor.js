import { Schema, model, models } from "mongoose";
const ActorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Tên diễn viên bắt buộc!'],
        unique: [true, 'Có diễn viên này rồi']
    },
    info: {
        type: String
    },
    avatar: {
        type: String,
    },
    slug: {
        type: String,
        required: [true, 'Slug bắt buộc']
    }
})

const Actor = models.Actor || model("Actor", ActorSchema)

export default Actor;