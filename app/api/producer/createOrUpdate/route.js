import Producer from '@models/producer';
import { connectToDB } from '@utils/database';
export const POST = async (req) => {
    const producer = await req.json();
    try {
        await connectToDB();
        if (producer.id != '') {
            const existProducer = await Producer.findByIdAndUpdate(producer.id, producer)
            if (existProducer) {
                return new Response("OK", {status: 200})
            }
            else {
                return new Response("Không tìm thấy NSX", {status: 500})
            }
        }
        else {
            const newProducer = await Producer.create({
                name: producer.name
            })
            if (newProducer) {
                return new Response("OK", {status: 200})
            }
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}