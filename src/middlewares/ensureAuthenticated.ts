import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { AuthConfig } from "@/config/auth"; // passando a config do JWT
import { AppError } from "@/utils/appError";

interface TokenPayLoad {
    role: string, // papel do usuario
    sub: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        // topo da requisição
        const authHeader = request.headers.authorization

        if (!authHeader) {
            throw new AppError("JWT token not found", 401)
        }

        // divisão do bearer do token
        const [, token] = authHeader.split(" ")

        // verificando o token com a jwt config e desistruturando
        const { role, sub: user_id } = verify(token, AuthConfig.jwt.secret) as TokenPayLoad

        // aidicionando os dados de usuario dentro da requisição
        request.user = {
            id: user_id,
            role,
        }

        return next()
    } catch (error) {
        throw new AppError("Invalid JWT token", 401)
    }
}

export { ensureAuthenticated }