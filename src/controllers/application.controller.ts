import type { Request, Response, NextFunction } from "express";
import type {
  JobApplication,
  UpdateApplication,
  IdParam,
} from "../vallidator/vallidator.ts";
import { prisma } from "../db/prisma.js";
import { ValidatonError } from "../errors/validation.error.js";
import type { ApplicationDetails } from "../generated/prisma/client.js";
import { Prisma } from "../generated/prisma/client.js";
export const addApplication = async (
  req: Request<{}, {}, JobApplication>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, company, source, date, status } = req.body;
    const newApplication = await prisma.applicationDetails.create({
      data: {
        title,
        company,
        source,
        date,
        status,
      },
    });
    res.status(201).json({
      success: true,
      message: `Application details saved`,
      data: newApplication,
    });
  } catch (error) {
    console.error(`Error:${(error as Error).message}`);
    next(error);
  }
};

// later i'll add pagination
export const getApplications = async (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const fetchApplications = await prisma.applicationDetails.findMany();
    res.status(200).json({
      success: true,
      message: `Applications fetched`,
      applications: fetchApplications,
      timeStamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error:${(error as Error).message}`);
  }
};

// now lets update data dynamically

export const updateApplication = async (
  req: Request<
    IdParam,
    {},
    UpdateApplication,
    {} /*here the first parameter is req.params params for this route,2nd is for response body,3rd is for req.body the data from client here we pass the interface not the actual schema,4th is req.query */
  >,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const allowedFilters = new Set<string>([
      "title",
      "company",
      "source",
      "date",
      "status",
      "interview_stage",
    ]);
    const queryDetails = Object.entries(req.body);
    if (!queryDetails.length)
      return next(
        new ValidatonError(`Provide atleast 1 field to update`, 400, [
          `update failed`,
        ]),
      );
    // update "ApplicationDetails" set 1=$1,2=$2,3=$3 where id=$after query.length
    // let dynamicQuery:string[]=[]
    let dynamicQuery: Prisma.Sql[] = [];
    //title='some',company='thing',
    for (let i = 0; i < queryDetails.length; i++) {
      const fieldName = queryDetails[i][0];
      const fieldValue = queryDetails[i][1];
      if (!allowedFilters.has(fieldName))
        return next(
          new ValidatonError(`Invalid field,cannot update`, 400, [
            `Provide query details like title,status,company`,
          ]),
        );
      dynamicQuery.push(Prisma.sql([`"${fieldName}" = `,""], fieldValue));
    }
    const setClause = Prisma.join(dynamicQuery, ", ");

    console.log(setClause);
    // this will always fail and cant use query.RawUnsafe() can inject sql so a diff approach
    const updatedApplication = await prisma.$queryRaw<
      ApplicationDetails[]
    >`update "ApplicationDetails" set ${setClause} where id =${id} returning *`;
    res.status(200).json({
      success: true,
      updatedApplication,
    });
  } catch (error) {
    console.error(`Error:${(error as Error).message}`);
    next(error);
  }
};
