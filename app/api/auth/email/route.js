import nodemailer from 'nodemailer'
export const POST = async (request) => {
    const {email, otp} = await request.json()
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASS
            }, 
        })
        const mailOptions = {
            from: process.env.GMAIL,
            to: "nhokuzumaki2003@gmail.com",
            subject: 'Sex69 Recovery Password',
            html: "<h1>Sex69 Recovery Password</h1>",
            text: 'Your OTP is ' + otp + ". It will expire in 5 minutes."
        }
        transporter.sendMail(mailOptions)
    }
    catch (error) {
        return new Response("Error!", {status: 500})
    }
}