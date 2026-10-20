import { configDotenv } from "dotenv";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";
configDotenv({
    path: './.env'
})
connectDB();
