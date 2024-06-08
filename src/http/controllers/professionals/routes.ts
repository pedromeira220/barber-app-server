import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { createProfessional } from "./create-professionals";
import { deleteProfessional } from "./delete-professionals";
import { getAllProfessional } from "./get-all-professionals";
import { getAllProfessionalFromBarbershop } from "./get-all-professionals-from-barbershop";

const professionalRouter = Router()

professionalRouter.post("/professionals", checkToken, async (req, res) => {
  return createProfessional(req, res)
})

professionalRouter.delete("/professionals/:id", checkToken, async (req, res) => {
  return deleteProfessional(req, res)
})

professionalRouter.get("/professionals", checkToken, async (req, res) => {
  return getAllProfessional(req, res)
})

professionalRouter.get("/professionals/barbershop/:barbershopId", checkToken, async (req, res) => {
  return getAllProfessionalFromBarbershop(req, res)
})

professionalRouter.put("/professionals/:id", checkToken, async (req, res) => {
  return getAllProfessional(req, res)
})

export {professionalRouter}