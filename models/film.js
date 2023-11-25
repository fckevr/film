import { ObjectId} from "mongodb";
import { Schema, model, models } from "mongoose";
const FilmSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'Tên phim đã được sử dụng!'],
        required: [true, 'Tên phim bắt buộc!'],
    },
    slug: {
        type: String,
        unique: [true, 'Slug đã được sử dụng!'],
        required: [true, 'Slug bắt buộc!'],
    },
    code: {
        type: String,
        unique: [true, 'Code đã được sử dụng!'],
    },
    actor: [{
        type: ObjectId,
        ref: 'Actor'
    }],
    producer: [{
        type: ObjectId,
        ref: 'Producer'
    }],
    tags: {
        type: [String],
        required: [true, 'Tags bắt buộc!'],
    },
    showtag: {
        type: String,
        required: [true, 'Tag hiển thị bắt buộc']
    },
    category: [{
        type: ObjectId,
        ref: 'Category'
    }],
    thumbnail: {
        type: String,
        required: [true, 'Ảnh bắt buộc!'],
    },
    link: [{
        type: String,
        required: [true, 'Link bắt buộc!'],
    }],
    description: {
        type: String,
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Film = models.Film || model("Film", FilmSchema)

export default Film;