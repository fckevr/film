
import Actor from '@models/actor';
import { connectToDB } from '@utils/database';
import { google } from 'googleapis';
import slugify from 'slugify';

const auth = await google.auth.getClient({
    keyFile: 'utils/sex69-398707-96b75bccc783.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
const sheets = google.sheets({ version: 'v4', auth });
const sheetId = '1qTCEM-WvnqvWPazp_6Hu0mE_aAoqH87iJI2iOQyRPt8'
export const GET = async (req) => {
    try {
        await connectToDB();
        // lấy dữ liệu trong sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'ActorImport', // Tên sheet
        });
        const values = response.data.values;
        if (values.length > 1) {
            for (const row of values) {
                if (row != values[0])
                {
                    const slug = slugify(row[0], {
                        locale: 'vi',
                        lower: true
                    })
                    const actor = await Actor.create({
                        name: row[0],
                        slug: slug,
                        info: row[1],
                        avatar: row[2]
                    })
                } 
            }
        }


        // xuất dữ liệu từ db ra sheet
        const actors = await Actor.find();
        const mapActors= actors.map(a => [a._id, a.name])
        const response2 = await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'ActorExport', // Tên sheet
            valueInputOption: 'RAW',
            requestBody: {
                values: mapActors
            }
        });
        
        return new Response("Done", {status: 200})
    }
    catch (error) {
        console.log(error)
        return new Response(error, {status: 500})
    }
}