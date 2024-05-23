import { Router } from "express";
import { updateBarbershop } from "./update-barbershop";
import { loginBarbershop } from "./logar-barbearia";
import { registerBarbershop } from "./register-barbershop";
import { getById } from "./get-by-id";
import { getAllBarbershops } from "./get-all-barbershops";
import { deleteBarbershop } from "./delete-barbershop";
import { checkToken } from "../../middlewares/check-token";
import { getAuthenticatedBarbershop } from "./get-authenticated-barbershop";

const barbershopRouter = Router()

barbershopRouter.post("/login", async (req, res) => {
  return loginBarbershop(req, res)
})

barbershopRouter.post("/barbershops", async (req, res) => {
  return registerBarbershop(req, res)
})

barbershopRouter.get("/barbershops/:id", async (req, res) => {
  return getById(req, res)
})

barbershopRouter.get("/barbershops", async (req, res) => {
  return getAllBarbershops(req, res)
})

barbershopRouter.delete("/barbershops/:id", checkToken, async (req, res) => {
  return deleteBarbershop(req, res)
})

barbershopRouter.put("/barbershops/:id", checkToken ,async (req, res) => {
  return updateBarbershop(req, res)
})

barbershopRouter.get("/barbershops/auth/me", checkToken, async (req, res) => {
  return getAuthenticatedBarbershop(req, res)
})

export {barbershopRouter}