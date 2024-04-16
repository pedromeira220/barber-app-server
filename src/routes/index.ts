import { Router } from "express";
import { logarBarbearia } from "./logar-barbearia";
import { cadastrarBarbearia } from "./cadastrar-barbearia";
import { buscarBarbeariaId } from "./buscar-barbearia-id";
import { buscarTodasBarbearias } from "./buscar-todas-barbearias";
import { deletarBarbearia } from "./deletar-barbearia";
import { atualizarBarbearia } from "./atualizar-barbearia";

const router = Router()

router.post("/login", async (req, res) => {
  return logarBarbearia(req, res)
})

router.post("/barbearias", async (req, res) => {
  return cadastrarBarbearia(req, res)
})

router.get("/barbearias/:id", async (req, res) => {
  return buscarBarbeariaId(req, res)
})

router.get("/barbearias", async (req, res) => {
  return buscarTodasBarbearias(req, res)
})

router.delete("/barbearias/:id", async (req, res) => {
  return deletarBarbearia(req, res)
})

router.put("/barbearias", async (req, res) => {
  return atualizarBarbearia(req, res)
})

export {router}