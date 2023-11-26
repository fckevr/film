import Transaction from "@models/transaction";
import { connectToDB } from "@utils/database";

export const GET = async(request, {params}) => {
    try {
        await connectToDB();
        const transaction = await Transaction.countDocuments({txHash: params.txhash})
        if (transaction >= 0) {
            return new Response(transaction, {status: 200})
        }
        else {
            return new Response("Error", {status: 500})
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}