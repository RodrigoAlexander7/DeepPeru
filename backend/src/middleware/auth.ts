import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"


interface authPayload extends JwtPayload {
   id: string,
   email: string,
   picture: string,
}

declare global {
   namespace Express {
      interface Request {
         user?: authPayload
      }
   }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization
   if (!authHeader) {
      return res.status(401).json({ message: 'No token provider' })
   }
   const token = authHeader.split(" ")[1]    // to take the seccong word of `Authorization: Bearer eyJhbGciOi...`

   try {
      const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as authPayload
      req.user = decoded
      next()
   } catch (error) {
      return res.status(403).json({ message: 'Error verifying token' })
   }
}