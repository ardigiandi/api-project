import express from "express";
import cors from 'cors'
import "dotenv/config";
import cookieParser from 'cookie-parser'
import connectionDB from "./config/db.js";
import router from "./routes/index.js";


const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api', router)

app.listen(PORT, () => {
  connectionDB()
  console.log(`server is running on ${PORT}`);
});
