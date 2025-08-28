import express from "express";
import cors from 'cors'
import "dotenv/config";
import cookieParser from 'cookie-parser'
import connectionDB from "./config/db.js";
import router from "./routes/index.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', router);

// ✅ Jalankan koneksi DB sekali (saat modul di-load)
connectionDB();

// ❌ Jangan pakai app.listen()
// ✅ Export app untuk Vercel
export default app;
