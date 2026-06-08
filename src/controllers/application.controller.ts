import type { Request,Response,NextFunction } from "express";
import type { JobApplication } from "../vallidator/vallidator.ts";
import { prisma } from "../db/prisma.js";

export const addApplication = async(req:Request<{},{},JobApplication>,res:Response,next:NextFunction):Promise<void>=>{
    try{
        const {title,company,source,date,status}=req.body;
        const newApplication = await prisma.applicationDetails.create({
            data:{
                title,
                company,
                source,
                date,
                status,
            }
        })
        res.status(201).json({
            success:true,
            message:`Application details saved`,
            data:newApplication
        })
    }
    catch(error)
    {
        console.error(`Error:${error.message}`)
    }
}