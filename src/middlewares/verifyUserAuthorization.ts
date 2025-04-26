import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/appError";
import { error } from "console";

function verifyUserAuthorization(role: string[]) {
    return (request: Request, response: Response, next: NextFunction) => {
        
        if(!request.user) {
            throw new AppError("Unauthorized", 401) //  verifica se usuario esta na requisição
        }

        if(!role.includes(request.user.role)){
            throw new AppError("Unauthorized", 401)
        }
          
        return next() // continuar o fluxo
    }
}

export { verifyUserAuthorization }