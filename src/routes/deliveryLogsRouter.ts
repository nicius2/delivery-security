import { Router } from "express";

import { DeliveryLogsController } from "@/controller/deliveryLogsController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const deliveryLogsRouter = Router()
const deliveryLogsController = new DeliveryLogsController()

deliveryLogsRouter.post("/",
    ensureAuthenticated,
    verifyUserAuthorization(["sale"]), // Para criar o log somente o vendedor

    deliveryLogsController.create
)

deliveryLogsRouter.get(
    "/:delivery_id/show",
    ensureAuthenticated,
    verifyUserAuthorization(["sale", "customer"]),
    
    deliveryLogsController.show
)

export { deliveryLogsRouter }