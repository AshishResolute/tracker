import type { Request, Response, NextFunction } from "express";
import type {
  JobApplication,
  UpdateApplication,
  IdParam,
  paginationQuery,
} from "../vallidator/vallidator.ts";
import { prisma } from "../db/prisma.js";
import { ValidatonError } from "../errors/validation.error.js";
import { NotFoundError } from "../errors/notFound.error.js";
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
  req: Request<{}, {}, {}, paginationQuery>,
  res: Response,
  next: NextFunction,
):Promise<void> => {
  try {
    // lets add offset based pagination
    // offset = (page*limit)-limit ex lets say i have 3 rows and limit as 1 then i would have 3 pages offset for page 1 should be 0 by (1*1)-1=0,for page 1 offset would be 1 meaning skip 1 row (2*1)-1=1
    // const {page,limit} = parseInt(req.query)// learnt that query params in express provide just read-only access cant modify it
    let { page, limit } = res.locals;
    page = page||1
    limit = limit||10
    let offset: number = page * limit - limit;
    // const fetchApplications = await prisma.applicationDetails.findMany();
    // need to write a custom query
    const fetchApplications =
      await prisma.$queryRaw<ApplicationDetails>`select * from "ApplicationDetails" limit ${limit} offset ${offset}`;
    res.setHeader('Access-Control-Allow-Origin','http://localhost:5173').status(200).json({
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
      dynamicQuery.push(Prisma.sql([`"${fieldName}" = `, ""], fieldValue));
    }
    const setClause = Prisma.join(dynamicQuery, ", ");

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

export const deleteApplication = async (
  req: Request<IdParam, {}, {}, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // just get the validated param applicationid and delete it
    const { id } = req.params;
    // usually getting around 50-60ms response time now let me use promise.all() to run both queries parallely and see the changes
    // const checkApplicationId = await prisma.applicationDetails.findFirst({
    //   where:{
    //     id
    //   }
    // })
    // Using Promise.all([]) returns an array of promises
    // const [checkApplicationId, deletedApplication] = await Promise.all([
    //   await prisma.applicationDetails.findFirst({
    //     where: {
    //       id,
    //     },
    //   }),
    //   await prisma.applicationDetails.delete({
    //     where: { id }
    //   }),
    // ]); 
    // // skipped promise.all() as the delete query is dependent on the first id check or else it will run delete on non existing id crashing the app
    // if (!checkApplicationId)
    //   return next(
    //     new NotFoundError(
    //       `Application does not exists`,
    //       400,
    //       `Application not found`,
    //     ),
    //   );
    const deletedApplication = await prisma.applicationDetails.delete({
      where:{id:parseInt(id,10)}
    })
    res.status(200).json({
      success: true,
      message: `Application Deleted successfully`,
      deletedApplication,
    });
  } catch (error) {
    // console.error(`Error:${(error as Error).message}`);
    if(error.code==='P2025')  return next(
        new NotFoundError(
          `Application does not exists`,
          400,
          `Application not found`,
        ),
      );
      // both the queries were dependent so just used a single query delete and handled the not found to delete in the catch block,as prisma return P2025 code
    next(error);
  }
};
