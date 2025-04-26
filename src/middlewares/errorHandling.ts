import { AppError } from "@/utils/appError";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandling(
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
) {
    // appError error handling -> client
    if (error instanceof AppError) {
        // returns the response and ends the flow
        return response.status(error.status).json({
            message: error.message,
        });
    }

    // zod error handling -> client
    if(error instanceof ZodError) {
        return response.status(400).json({
            message: "validation error",
            issues: error.errors.map(({path, message}) => ({
                field: path.join("."),
                message
            }))
        })
    }

    // otherwise, return error 500 -> server
    console.log("middleware ativo")
    return response.status(500).json({
        message: "Internal Server Error",
    });
}
