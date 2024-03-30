import { Router } from "express";
import { logarBarbearia } from "./logar-barbearia";
import { cadastrarBarbearia } from "./cadastrar-barbearia";

const router = Router()

router.post("/login", async (req, res) => {
  return logarBarbearia(req, res)
})

router.post("/cadastrar-barbearia", async (req, res) => {
  return cadastrarBarbearia(req, res)
})

export {router}