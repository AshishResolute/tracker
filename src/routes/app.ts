import express from "express";
import application from './application.js'
import type { Request,Response } from "express";
import morgan from 'morgan'
import { errorHandler } from "../middlewares/errorHandler.js";
import cors from 'cors'
const app = express();

app.use(cors({
  origin:"http://localhost:5173"
}))
app.use(express.json());
app.use(morgan('dev'))
app.get("/health", (req:Request, res:Response) => {
  res.status(200).json({
    success: true,
    message: `Services running well!`,
    timeStamp: new Date().toISOString(),
  });
});



app.use('/application',application)


app.use(errorHandler)

export { app };
