import { NextFunction, Request, Response } from "express";
import { prisma } from "@/database/prisma"
import { z } from "zod";
import { AppError } from "@/utils/appError";

class DeliveryLogsController {
    // creating the log to report the delivery
    async create(request: Request, response: Response) {
        try {
            const bodySchema = z.object({
                delivery_Id: z.string().uuid(),
                description: z.string()
            })

            const { delivery_Id, description } = bodySchema.parse(request.body)

            // procurando o unico id segundo o pedido
            const delivery = await prisma.delivery.findUnique({ where: { id: delivery_Id } })

            if (!delivery) {
                throw new AppError("delivery not found", 404)
            }

            // check if delivery has already been processed
            if (delivery.status === "delivered") {
                throw new AppError("this order has already been delivered", 400)
            }

            // check if delivery is still procesing
            if (delivery.status === "processing") {
                throw new AppError("change status to shipped")
            }

            await prisma.deliveryLog.create({
                data: {
                    deliveryId: delivery_Id,
                    description
                }
            })

            return response.json()
        } catch (error) {

        }

    }

    async show(request: Request, response: Response, next: NextFunction) {
        try {
            const paramsSchema = z.object({
                delivery_id: z.string().uuid()
            })

            const { delivery_id } = paramsSchema.parse(request.params)

            const delivery = await prisma.delivery.findUnique({
                where: { id: delivery_id },
                include: {
                    logs: { select: { id: true, description: true } },
                    user: { select: { id: true, name: true, email: true } }
                }
            })

            if (request.user?.role === "customer" &&
                request.user.id !== delivery?.userId
            ) {
                throw new AppError("the user can only view their deliveries", 401)
            }

            return response.status(201).json(delivery)
        } catch (error) {
            next(error)
        }
    }
}

export { DeliveryLogsController }