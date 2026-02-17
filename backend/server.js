import express from "express";
import cors from "cors";
import { ConnectDB } from "./config/db.js";
import { Authrouter } from "./routes/Auth.js";
import { configDotenv } from "dotenv";
import { Prorouter } from "./routes/ProRou.js";

configDotenv();
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", Authrouter);
app.use("/api1", Prorouter);

ConnectDB();

app.listen(process.env.PORT, () => {
  console.log(`SERVER IS RUNNNIG ON ${process.env.PORT}...`);
});
