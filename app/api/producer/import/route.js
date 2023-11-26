import Producer from '@models/producer';
import { connectToDB } from '@utils/database';
import { google } from 'googleapis';

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
            range: 'ProducerImport', // Tên sheet
        });
        const values = response.data.values;
        if (values.length) {
            for (const row of values) {
                if (row != values[0])
                {
                    const newProducer = await Producer.create({
                        name: row[0]
                    })
                } 
            }
        }


        // xuất dữ liệu từ db ra sheet
        const producers = await Producer.find();
        const mapProducers= producers.map(p => [p._id, p.name])
        const response2 = await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'ProducerExport', // Tên sheet
            valueInputOption: 'RAW',
            requestBody: {
                values: mapProducers
            }
        });
        
        return new Response("Done", {status: 200})
    }
    catch (error) {
        console.log(error)
        return new Response(error, {status: 500})
    }
}