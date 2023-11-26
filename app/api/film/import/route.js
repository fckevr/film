
import Film from '@models/film';
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
            range: 'FilmImport', // Tên sheet
        });
        const values = response.data.values;
        if (values) {
            for (const row of values) {
                if (row != values[0])
                {
                    const slug = slugify(row[0], {
                        locale: 'vi',
                        lower: true
                    })
                    const film = await Film.create({
                        name: row[0],
                        slug: slug,
                        code: row[1],
                        actor: row[2].split("\n"),
                        producer: row[3].split("\n"),
                        tags: row[4].split(","),
                        showtag: row[5],
                        category: row[6].split("\n"),
                        thumbnail: row[7],
                        link: row[8].split("\n"),
                        description: row[9]
                    })
                } 
            }
        }
        
        return new Response("Done", {status: 200})
    }
    catch (error) {
        console.log(error)
        return new Response(error, {status: 500})
    }
}