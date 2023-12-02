import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@utils/database";
import bcrypt from 'bcrypt';
import User from "@models/user";
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                const response = await fetch(process.env.APP_URL + '/api/auth/signin',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password 
                    })
                })
                if (response.ok) {
                    const user = await response.json();
                    if (user)
                    {
                        return user
                    }
                    else 
                    {
                        return null
                    }
                }
                else {
                    return null
                }
            }
        })
    ],
    callbacks: {
        // jwt: async ({token}) => {
        //     const user = await User.findOne({
        //         email: session.user.email
        //     })
        //     if (user) {
        //         token.id = user._id.toString();
        //         token.role = user.role;
        //         token.username = user.username;
        //         token.avatar = "https://drive.google.com/uc?export=view&id=" + user.avatar;
        //     }
        //     console.log(token)
        //     return token
        // },
        // session: async ({session, token}) => {
        //     // const user = await User.findOne({
        //     //     email: session.user.email
        //     // })
        //     // session.user.username = user.username;
        //     // session.user.avatar = "https://drive.google.com/uc?export=view&id=" + user.avatar;
        //     // session.user.email = ""
        //     return session
        // }
        async signIn({profile, credentials}) {
            try {
                await connectToDB();
                let email;
                if (profile) {
                    email = profile.email
                }
                else {
                    email = credentials.email
                }
                let userExist = await User.findOne({
                    email: email
                })
                if (!userExist) {
                    const salt = await bcrypt.genSalt(10)
                    const index = profile.email.lastIndexOf('@')
                    let username = profile.email.slice(0,index)
                    let usernameUse = username
                    // check username already used or not
                    let count = User.countDocuments({username: usernameUse})
                    while (count > 0) {
                        usernameUse = username + Math.floor(Math.random() * 1001).toString()
                        count = User.countDocuments({username: usernameUse})
                    }
                    const hashPassword = await bcrypt.hash(usernameUse, salt)
                    try {
                        userExist = await User.create({
                            email: profile.email,
                            username: usernameUse,
                            avatar: profile.picture,
                            password: hashPassword,
                            role: "user"
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
                return userExist
            }
            catch (error) {
                return false
            }
        },
        async jwt({token, user, trigger, session}) {
                // const userDB = await User.findOne({
                //     email: user.email
                // })
                // token.id = userDB.id,
                // token.username = userDB.username
                // token.avatar = "https://drive.google.com/uc?export=view&id=" + userDB.avatar
                // token.email = ""
                // return token
                if (trigger === "update") {
                    return {
                        ...token,
                        ...session.user
                    }
                }
                if (user) {
                    const userDB = await User.findOne({
                        email: user.email
                    })
                    let avatar = ''
                    if (user.image != null)
                    {   
                        avatar = user.image
                    }
                    else {
                        if (userDB.avatar != '') {
                            avatar = "https://drive.google.com/uc?export=view&id=" + userDB.avatar
                        }
                        
                    }
                    return {
                        ...token,
                        id: userDB._id,
                        email: "",
                        username: userDB.username,
                        avatar: avatar,
                        role: userDB.role,
                        saved: userDB.saved,
                        balance: userDB.balance
                    }
                }
                return token
        },
        async session({session, token}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username,
                    avatar: token.avatar,
                    id: token.id,
                    saved: token.saved,
                    balance: token.balance
                }
            }
        }
    },
    session: {
        strategy: "jwt",
    }
})

export {handler as GET, handler as POST}
