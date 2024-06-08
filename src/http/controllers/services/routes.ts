import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { createService } from "./create-service";
import { getAllService } from "./get-all-service";
import { getAllServicesFromBarbershop } from "./get-all-services-from-barbershop";
import { updateService } from "./update-service";

const serviceRouter = Router()

serviceRouter.post("/services", checkToken, async (req, res) => {
  return createService(req, res)
})

serviceRouter.delete("/services/:id", checkToken, async (req, res) => {
  return createService(req, res)
})

serviceRouter.get("/services", checkToken, async (req, res) => {
  return getAllService(req, res)
})

serviceRouter.get("/services/barbershop/:barbershopId", checkToken, async (req, res) => {
  return getAllServicesFromBarbershop(req, res)
})

serviceRouter.put("/services/:id", checkToken, async (req, res) => {
  return updateService(req, res)
})

export {serviceRouter}