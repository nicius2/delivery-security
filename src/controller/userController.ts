    import { Request, Response, NextFunction } from "express";
    import { z } from "zod"
    import { hash } from "bcrypt";
    import { prisma } from "@/database/prisma";
    import { AppError } from "@/utils/appError";

    class UserController {

        async create(request: Request, response: Response, next: NextFunction) {
            try {
                // validando todos os dados que vem para cadastro do usuario
                const bodySchema = z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().min(6),
                })

                const { name, email, password } = bodySchema.parse(request.body) // desistruturando e passando para a request

                // Verificando se existe usuario ja cadastrado -> primeiro a retornar
                const userWithSameEmail = await prisma.user.findFirst({ where: { email } }) // primeiro que achar o email

                // se ja estiver lança um exceção
                if (userWithSameEmail) {
                   next(new AppError("User with same email already exists", 400))
                }

                // gera um hash do password
                const hashedPassword = await hash(password, 8)

                // colocando todas as informações ja validadas no database
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                    }
                })

                // desistruturando e tirando o password de user para passar para o response
                const { password: _, ...userWithhoutPassword } = user

                return response.status(201).json(userWithhoutPassword)
            } catch (error) {
                next(error)
            }
        }
    }

    export { UserController }