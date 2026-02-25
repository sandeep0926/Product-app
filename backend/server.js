import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { ConnectDB } from "./config/db.js";
import { Authrouter } from "./routes/Auth.js";
import { configDotenv } from "dotenv";
import { Prorouter } from "./routes/ProRou.js";

configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", Authrouter);
app.use("/api1", Prorouter);
/////////
ConnectDB();

app.listen(process.env.PORT, () => {
  console.log(`SERVER IS RUNNNIG ON ${process.env.PORT}...`);
});
