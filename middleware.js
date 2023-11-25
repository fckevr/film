
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// export default withAuth({
//   callbacks: {
//     authorized({ req, token }) {
//       // `/admin` requires admin role
//       // if (req.nextUrl.pathname.startsWith('/admin')) {
//       //   return token?.userRole === "admin"
//       // }
//       if (req.nextUrl.pathname.includes('api/chat')) {
//           if (token && token.role == 'user' && token.id) {
//             req.json().then((data) => {
//               if (data.user_id == token.id) {
//                 return true
//               }
//               throw new Error("Fuck!")
//             }) 
//           }
//           else  {
//             throw new Error("Fuck!")
//           }
//       }

//     },
//   },
// })
// })
// export default withAuth(req => {
//   console.log(req.nextUrl.pathname)
//   if (req.nextUrl.pathname.startsWith("/signin") || req.nextUrl.pathname.startsWith("/signup")) {
//     if (req.nextauth.token) {
//       return NextResponse.redirect(new URL('/', req.url))
//     }
//   }

//   if (req.nextUrl.pathname.includes('api/chat')) {
//     console.log("chi z")
//     if (req.nextauth.token && req.nextauth.token.role == 'user' && req.nextauth.token.id) {
//       req.json().then((data) => {
//         if (data.user_id == req.nextauth.id) {
//           console.log("bdu")
//           return true
//         }
//         console.log("cdu")
//         return NextResponse.redirect("/")
//       }) 
//     }
//     else  {
//       console.log(" adu")
//       return NextResponse.redirect("/")
//     }
// }
// })



export default withAuth(
  async function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/signin") || req.nextUrl.pathname.startsWith("/signup")) {
      if (req.nextauth.token) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    if (req.nextUrl.pathname.startsWith("/profile")) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      if (!req.nextUrl.pathname.endsWith(req.nextauth.token.username)) {
        return NextResponse.redirect(new URL('/profile/' + req.nextauth.token.username, req.url))
      }
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // dưới này là check có token không, có token thì chạy trong code,ko là bắt đăng nhập
        if (req.nextUrl.pathname.includes('api/chat')) {
            if (token && token.role == 'user' && token.id) {
              req.json().then((data) => {
                if (data.user_id == token.id) {
                  return true
                }
                throw new Error("Fuck!")
              }) 
            }
            else  {
              throw new Error("Fuck!")
            }
        }
        else if (req.nextUrl.pathname.startsWith("/signin") || req.nextUrl.pathname.startsWith("/signup")) {
          return true
        }
        else if (req.nextUrl.pathname.startsWith("/profile")) {
          return true
        }
      } 
    },
  }
)

export const config = { matcher: ["/api/chat", "/signin", "/signup", "/profile/:path*"] }