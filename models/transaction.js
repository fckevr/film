import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";
const TransactionSchema = new Schema({
    idUser: {
        type: ObjectId,
        required: [true, 'Id user required!'],
    },
    txHash: {
        type: String,
        unique: [true, 'Tx hash already exists!'],
        required: [true, 'Tx hash required!'],
    },
    currency: {
        type: String,
        required: [true, 'Currentcy required!'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount required!'],
    }
}, {
    timestamps: true
})

const Transaction = models.Transaction || model("Transaction", TransactionSchema)

export default Transaction;