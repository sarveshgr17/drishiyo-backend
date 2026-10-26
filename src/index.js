import { configDotenv } from "dotenv";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";
import { app } from "./app.js";
configDotenv({
    path: "./.env",
});
connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error: ", error);
        });
        
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(` Server is running at port : ${port} `);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed (index.js): ", error);
    });
