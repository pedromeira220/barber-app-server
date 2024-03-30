import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const logarBarbearia = async (req: Request, res: Response) => {
  const {email, senha} = req.body

  // Para logar uma barbearia no sistema, é necessário receber o nome e a senha

  if(!email) {
    return res.status(400).json({
      msg: "O email é obrigatório"
    })
  } 

  if(!senha) {
    return res.status(400).json({
      msg: "A senha é obrigatória"
    })
  }

  // Fazer daqui pra baixo a lógica do login (para saber mais como continuar, acesse o card do Trello)
}