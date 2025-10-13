import express, { Request, Response } from "express";
import dotenv from "dotenv"
import authRouter from './auth/auth.rute'

dotenv.config()   // load environment var
const port = 3000;
const app = express();

app.use(express.json())   // middleware to acept json responses
app.use(authRouter)

app.get("/", (req: Request, res: Response) => {
   res.send("Hello word xd");
});

app.listen(port, () => {
   console.log(`Servidor corriendo en http://localhost:${port}`);
});
