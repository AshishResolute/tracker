import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    const details = await prisma.$queryRaw<{ now: Date }[]>`select now()`;
    console.log(`Database connected via Prisma`, details[0]?.now);
  } catch (error) {
    console.error(`Database connection Failed`);
    process.exit(1);
  }
})();
export { prisma };
