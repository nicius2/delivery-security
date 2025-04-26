import { prisma } from "@/database/prisma";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";


class DeliveryController {
    //criando um pedido
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                user_id: z.string().uuid(), // usando  o id do cliente
                description: z.string(), // descrição do pedido
            })

            const { user_id, description } = bodySchema.parse(request.body)

            // colocando o pedido no database
            await prisma.delivery.create({
                data: {
                    userId: user_id,
                    description
                }
            })

            return response.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    // lista os usuarios 
    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const deliveries = await prisma.delivery.findMany({
                include: {
                    user: { select: { name: true, email: true } } // informando o nome e email do cliente
                }
            })

            return response.json(deliveries)
        } catch (error) {
            next(error)
        }
    }
}

export { DeliveryController }