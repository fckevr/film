import { ObjectId } from "mongodb";
import { Schema, model, models } from "mongoose";
const UserSchema = new Schema({
    username: {
        type: String,
        unique: [true, 'Tên tài khoản đã được sử dụng!'],
        required: [true, 'Tên tài khoản bắt buộc!'],
        match: [/^.{6,}$/, "Tên tài khoản phải có ít nhất 6 kí tự"]
    },
    email: {
        type: String,
        unique: [true, 'Email đã được sử dụng!'],
        required: [true, 'Email bắt buộc!'],
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu bắt buộc!'],
        match: [/^.{8,}$/, "Mật khẩu phải có ít nhất 8 kí tự"]
    },
    saved: [{
        type: ObjectId,
        ref: 'Film'
    }],
    avatar: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    },
    role: {
        type: String
    }
})

const User = models.User || model("User", UserSchema)

export default User;