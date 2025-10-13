import { ExpressAuthConfig } from "@auth/express"
import Google from "@auth/express/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

// we dont load environment var here cause we do it on the global auth 
// instance on index

const prisma = new PrismaClient()

export const authConfig: ExpressAuthConfig = {
   adapter: PrismaAdapter(prisma),
   providers: [
      Google({
         clientId: process.env.AUTH_GOOGLE_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
   ],
   callbacks: {
      async session({ session, user }) {
         session.user.id = user.id
         return session
      }
   }
} 