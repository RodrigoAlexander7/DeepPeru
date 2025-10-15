import { ExpressAuthConfig } from "@auth/express"
import Google from "@auth/express/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@/generated/prisma"
import jwt from "jsonwebtoken"
import { ENV } from "@/configs/env";



// we dont load environment var here cause we do it on the global auth 
// instance on index

const prisma = new PrismaClient()

export const authConfig: ExpressAuthConfig = {
   adapter: PrismaAdapter(prisma),
   secret: ENV.AUTH_SECRET!,
   session: { strategy: "jwt" },
   providers: [
      Google({
         clientId: ENV.AUTH_GOOGLE_ID!,
         clientSecret: ENV.AUTH_GOOGLE_SECRET!,
      })
   ],
   callbacks: {
      async jwt({ token, user }) {        // create a jwt with the user id (from the DB)
         if (user) { token.id = user.id }
         return token
      },

      async session({ session, token }) {
         // creating custom JWR
         const accesToken = jwt.sign(
            {
               id: token.id,     // the user id (added in the jwt callback)
               email: token.email,
               picture: token.picture
            },
            process.env.AUTH_SECRET!,
         )

         session.user.id = token.id as string
         session.sessionToken = accesToken
         console.log('Custom JWT:', accesToken)
         return session
      }
   }
} 