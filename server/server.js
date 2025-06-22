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

const allowedOrigins = ['http://localhost:5173', 'https://meds-management-project-frontend.vercel.app']

app.use(cors({origin: allowedOrigins, credentials: true}))

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