import { Schema, model, models } from "mongoose";
const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Tên thể loại bắt buộc!'],
        unique: [true, 'Có thể loại này rồi']
    }
})

const Category = models.Category || model("Category", CategorySchema)

export default Category;