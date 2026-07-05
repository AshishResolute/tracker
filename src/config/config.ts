import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'node:url';


const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath)

dotenv.config({path:(path.join(__dirname,`../../.env.${process.env.NODE_ENV}`))})


export const PORT=process.env.SERVER_PORT

export const DATABASE_URL=process.env.DATABASE_URL
