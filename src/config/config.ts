import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'node:url';


const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath)

dotenv.config({path:(path.join(__dirname,'../../.env'))})

export const PORT=process.env.SERVER_PORT||3000
