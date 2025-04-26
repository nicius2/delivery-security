import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma"
import { z } from "zod";


class DeliveryStatusController {
    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const paramsSchema = z.object({
                id: z.string().uuid()
            })
    
            // passando os tuipos de status
            const bodySchema = z.object({
                status: z.enum(["processing", "shipped", "delivered"])
            })
    
            // desistruturando 
            const { id } = paramsSchema.parse(request.params)
            const { status } = bodySchema.parse(request.body)
    
            await prisma.delivery.update({
                data: {
                    status,
                },
                where: {
                    id,
                }
            })
    
            // Adicionando um log toda vez que o status mudar
            await prisma.deliveryLog.create({
                data: {
                    deliveryId: id,
                    description: status,
                }
            })
    
            return response.json()   
        } catch (error) {
            next(error)
        }
    }
}

export { DeliveryStatusController }
