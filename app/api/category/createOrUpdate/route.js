import Category from '@models/category';
import { connectToDB } from '@utils/database';
export const POST = async (req) => {
    const category = await req.json();
    try {
        await connectToDB();
        if (category.id != '') {
            const existCategory = await Category.findByIdAndUpdate(category.id, category)
            if (existCategory) {
                return new Response("OK", {status: 200})
            }
            else {
                return new Response("Không tìm thấy thể loại", {status: 500})
            }
        }
        else {
            const newCategory = await Category.create({
                name: category.name
            })
            if (newCategory) {
                return new Response("OK", {status: 200})
            }
        }
    }
    catch (error) {
        return new Response(error, {status: 500})
    }
}