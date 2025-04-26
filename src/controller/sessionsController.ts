import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/appError";
import { compare } from "bcrypt";
import { AuthConfig } from "@/config/auth";
import { sign } from "jsonwebtoken";

class SessionsController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            // Validando os dados que vem de request
            const bodySchema = z.object({
                email: z.string().email(),
                password: z.string().min(6),
            })

            const { email, password } = bodySchema.parse(request.body) // passando os dados para o corpo da requisição

            const user = await prisma.user.findFirst({ where: { email } }) // encontrando o primeiro email

            // verifica se tem o usuario com o email passado
            if (!user) {
                throw new AppError("Invalid email or password", 401)
            }

            // comparando se a senha passada esta de acordo com a cadastrada pelo usuario
            const passwordMatched = await compare(password, user.password)

            if (!passwordMatched) {
                throw new AppError("Invalid email or password", 401)
            }

            // Desistruturando o 'jwt config'
            const { secret, expiresIn } = AuthConfig.jwt

            // Gerando o Token de autenticação
            const token = sign({ role: user.role ?? "customer" }, secret, {
                subject: user.id,
                expiresIn
            })

            // separando a senha e o restante do corpo do usuario cadastrado
            const { password: hashedPassword, ...userWithoutPassword } = user

            // mostrando o token e o usuario
            return response.json({ token, user: userWithoutPassword })
        } catch (error) {
            next(error)
        }
    }
}

export { SessionsController }