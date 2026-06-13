import type { Request, Response, NextFunction } from "express";
import { ValidatonError } from "../errors/validation.error.js";
import { NotFoundError } from "../errors/notFound.error.js";
export const errorHandler = (
  err: Error,// here now validationError properties wont me accessible as its the child class
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    // this will fail when i hit a generic Error not just a validationError so i need to check if the passed err object its an instance of that class as some properties are just defined in the custom error class and not available in the Error class
  
  if(err instanceof ValidatonError||err instanceof NotFoundError)
{
    const ErrorDetails = {
    success:false,
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || 500,
    internalMessage: err.internalMessage || err.message,
  };
  return res.status(err.statusCode).json(ErrorDetails)
}
  res.status(500).json({
    succees:false,
    Error:err.message
  });
};
