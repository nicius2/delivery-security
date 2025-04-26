import { Router } from "express";

import { userRouter } from "./userRouter";
import { sessionsRouter } from "./sessionsRouter";
import { deliveryRouter } from "./deliveryRouter";
import { deliveryLogsRouter } from "./deliveryLogsRouter"

const routes = Router()

routes.use("/user", userRouter)
routes.use("/session", sessionsRouter)
routes.use("/deliveries", deliveryRouter)
routes.use("/deliveries-log", deliveryLogsRouter)

export { routes }