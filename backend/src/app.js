import express from "express";
import cookieParser from "cookie-parser";
import convertRouter from "./routes/convert.routes.js"; 
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"))


app.use("/api/v1/convert", convertRouter);


app.use('*name',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"))
})

export default app;