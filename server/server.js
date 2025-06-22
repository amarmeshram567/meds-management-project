import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import medicationRoutes from "./routes/medicationsRoutes.js";
import { initialDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    },
));

app.use(express.json())

app.use(cookieParser())



// database connected
await initialDB()

app.get('/', (req, res) => {
    res.send('API is working')
})

app.use('/api/user', userRouter);
app.use('/api/medications', medicationRoutes)


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})