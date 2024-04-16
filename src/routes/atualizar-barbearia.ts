import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const atualizarBarbearia = async (req: Request, res: Response) => {
  const { id, nome, nomeContato, telefoneContato } = req.body

  if(!id) {
    return res.status(400).json({
      msg: "O id é obrigatório"
    })
  } 

  await prisma.barbearia.update({
    where: {
      id
    },
    data: {
      nome,
      nome_contato: nomeContato,
      telefone_contato: telefoneContato
    }
  })

  return res.send()
}