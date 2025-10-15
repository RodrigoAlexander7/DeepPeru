import dotenv from "dotenv"

dotenv.config()

export const ENV = {
   DATABASE_URL: process.env.DATABASE_URL,
   AUTH_SECRET: process.env.AUTH_SECRET,

   AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
   AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

   GEMINI_API_KEY: process.env.GEMINI_API_KEY,

}