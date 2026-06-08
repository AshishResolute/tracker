import express from "express";
import application from './application.js'
import type { Request,Response } from "express";

const app = express();

app.use(express.json());

app.get("/health", (req:Request, res:Response) => {
  res.status(200).json({
    success: true,
    message: `Services running well!`,
    timeStamp: new Date().toLocaleString(),
  });
});

app.use('/application',application)



const PORT = process.env.PORT || 3000;

export { app, PORT };
