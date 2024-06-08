import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { createProfessional } from "./create-professionals";
import { deleteProfessional } from "./delete-professionals";
import { getAllProfessional } from "./get-all-professionals";

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

professionalRouter.put("/professionals/:id", checkToken, async (req, res) => {
  return getAllProfessional(req, res)
})

export {professionalRouter}