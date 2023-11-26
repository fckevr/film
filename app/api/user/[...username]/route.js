import Film from "@models/film";
import Transaction from "@models/transaction";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        if (params.username[0] == "find") {
            const users = await User.find({username: {$regex: params.username[1], $options: 'i'}}, {_id: 1, username: 1, avatar: 1}).lean()
        
            if (users) {
                return new Response(JSON.stringify(users), {status: 200})
            }
            else {
                return new Response("Error", {status: 500})
            }
        }
        else if (params.username[0] == "get") {
            const users = await User.findOne({username: params.username[1]}, {_id: 1, username: 1, avatar: 1, email: 1, saved: 1, balance: 1}).populate({
                path: 'saved',
                model: Film,
                select: '_id name thumbnail slug showtag'
            }).lean()
            const transactions = await Transaction.find({idUser: users._id}).lean()
            users.transactions = transactions
            if (users) {
                return new Response(JSON.stringify(users), {status: 200})
            }
            else {
                return new Response("Error", {status: 500})
            }
        }
        else if (params.username[0] == "email") {
            const user = await User.findOne({email: params.username[1]}, {_id: 1, username: 1, avatar: 1}).lean()
            if (user) {
                return new Response("OK", {status: 200})
            }
            else {
                return new Response("Error", {status: 500})
            }
        }
       
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}
