
import Transaction from '@models/transaction';
import User from '@models/user';
import { connectToDB } from '@utils/database';
export const POST = async (req) => {
    const transaction = await req.json();
    try {
        await connectToDB();
        const newTransaction = await Transaction.create({
            idUser: transaction.idUser,
            txHash: transaction.txHash,
            currency: transaction.currency,
            amount: transaction.amount
        })
        if (newTransaction) {
            const user = await User.findById(transaction.idUser)
            user.balance = Number(user.balance) + Number(transaction.amount)
            await User.findByIdAndUpdate(transaction.idUser, user)
            return new Response(JSON.stringify(newTransaction), {status: 200})
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}