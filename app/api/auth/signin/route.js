import { connectToDB } from "@utils/database";
import User from "@models/user";
import bcrypt from 'bcrypt'
export const POST = async (request) => {
    const {email, password} = await request.json()
    try {
        await connectToDB();
        const user = await User.findOne({
            email: email
        })
        if (user) {
            const checkPass = await bcrypt.compare(password, user.password)
            if (checkPass)
            {
                return new Response(JSON.stringify(user), {status: 200})
            }
            else
            {
                return new Response("Mật khẩu không chính xác!", {status: 500})
            }   
        }
        else
        {
            return new Response("Email và mật khẩu không chính xác!", {status: 500})
        }
    }
    catch (error) {
        return new Response("Đã có lỗi xảy ra, vui lòng thử lại!", {status: 500})
    }
}