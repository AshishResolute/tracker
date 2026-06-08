import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod/v3";

const validate = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = await schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: `Validation Failed`,
        errors: result.error.issues.map((err)=>err.message),
      });
      
      return;
    }

    req.body = result.data;
    next();
  };
};

export default validate;
