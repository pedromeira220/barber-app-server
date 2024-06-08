import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { createClientes } from "./create-clientes";
import { deleteClient } from "./delete-clientes";
import { getAllClients } from "./get-all-clients";
import { getAllClientsFromBarbershop } from "./get-all-clients-from-barbershop";

const clientesRouter = Router()

clientesRouter.post("/clients", checkToken, async (req, res) => {
  return createClientes(req, res)
})

clientesRouter.delete("/clients/:id", checkToken, async (req, res) => {
  return deleteClient(req, res)
})

clientesRouter.get("/clients", checkToken, async (req, res) => {
  return getAllClients(req, res)
})

clientesRouter.get("/clients/barbershop/:barbershopId", checkToken, async (req, res) => {
  return getAllClientsFromBarbershop(req, res)
})

clientesRouter.put("/clients/:id", checkToken, async (req, res) => {
  return getAllClients(req, res)
})

export {clientesRouter}