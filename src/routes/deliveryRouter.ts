import { Router } from "express";

import { DeliveryController } from "@/controller/deliveryController";
import { DeliveryStatusController } from "@/controller/deliveriesStatusController";

import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveryRouter = Router()
const deliveryController = new DeliveryController()
const deliveriesStatusController = new DeliveryStatusController()

/*
    1. autenticando o usurio -> comparando com o token gerado
    2. verificação do usuario -> se o usuario é vendedor ou usuario
*/

deliveryRouter.use(ensureAuthenticated, verifyUserAuthorization(["sale"]))
deliveryRouter.post("/", deliveryController.create)
deliveryRouter.get("/", deliveryController.index)

// usando o 'patch' pois vai atualizar só um campo especifico
deliveryRouter.patch("/:id/status", deliveriesStatusController.update)

export { deliveryRouter }