import { ZodError } from "zod";
import { AppError } from "../utils/AppErrors.js";

export const validateRequest = (schema) => {
    return (req, res, next) => {
       try{
            //console.log(req.body);
            schema.parse(req.body);
            next();
       } catch (error) {
            //console.error("Validation Error --> :", error);
            if(error instanceof ZodError){
                const message = error.issues.map(err => err.message).join(", ");
                return next(new AppError(message, 400));
            }
            next(error);
       }
    }
}