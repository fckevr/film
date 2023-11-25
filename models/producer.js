import { Schema, model, models } from "mongoose";
const ProducerSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'Có nhà sản xuất này rồi'],
        required: [true, 'Tên nhà sản xuất bắt buộc!'],

    }
})

const Producer = models.Producer || model("Producer", ProducerSchema)

export default Producer;