

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { DATABASE_URL } from "../config/config.js";

const connectionString = DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    const details = await prisma.$queryRaw<{ now: Date }[]>`select now()`;
   return  console.log(`Database connected via Prisma`, details[0]?.now);
  } catch (error) {
    console.error(`Database connection Failed`,error);
    // process.exit(1);
  }
})();
export { prisma };
