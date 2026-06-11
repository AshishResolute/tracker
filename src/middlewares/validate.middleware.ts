import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";
import { ValidatonError } from "../errors/validation.error.js";

interface RequestValidationSchema {
  params?: ZodObject;
  body?: ZodObject;
  query?: ZodObject;
}

const validate = (schema: RequestValidationSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (schema.params) {
      const result = await schema.params.safeParse(req.params);

      if (!result.success) {
        return next(
          new ValidatonError(
            `Invalid Params received`,
            400,
            result.error.issues.map((err) => err.message),
          ),
        );
      }
      req.params = result.data as any;
      console.log(req.params)
    }
    if (schema.body) {
      const result = await schema.body.safeParse(req.body);

      if (!result.success) {
        // have implemented an global error handler middleware which takes a custom error class to get clean and clear error messages.
        // res.status(400).json({
        //   success: false,
        //   message: `Validation Failed`,
        //   errors: result.error.issues.map((err)=>err.message),
        // });
        // here i was stuck with type mismatch as my third argument in error class expects a string[] but result.error.issues is not an string[] its an custom [{}] meaning array of ZodError which are custom objects so i had to map over the array of objects(ZodError) to pass the array of strings
        return next(
          new ValidatonError(
            `Input validation Failed`,
            400,
            result.error.issues.map((err): string => err.message),
          ),
        );
      }
      // learnt that next is just an function call it doesn't ends our function just runs the desired function or moves to next function,so return is imp to handle headers already sent if some middleware has already sent a response back to client
      req.body = result.data;
    }
    if (schema.query) {
      const result = await schema.query.safeParse(req.query);
      if (!result.success)
        return next(
          new ValidatonError(
            `Invalid query parameters provided`,
            400,
            result.error.issues.map((err) => err.message),
          ),
        );
      req.query = result.data as any;
    }
    next();
  };
};

export default validate;
