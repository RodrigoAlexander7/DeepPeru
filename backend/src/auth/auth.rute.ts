import { ExpressAuth } from "@auth/express"
import { authConfig } from "./auth.config"
import { Router } from "express"

const authRouter = Router()

authRouter.use("/auth/*", ExpressAuth(authConfig))

export default authRouter

