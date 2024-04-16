import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const deletarBarbearia = async (req: Request, res: Response) => {
  const { id } = req.params

  if(!id) {
    return res.status(400).json({
      msg: "O id é obrigatório"
    })
  } 


  // Aqui a barbearia é criada no banco de dados
await prisma.barbearia.delete({
   where: {
    id
   }
  })

  // Aqui a gnt retorna a barbearia criada na api
  return res.status(201).send()
}