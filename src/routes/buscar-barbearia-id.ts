import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { BarbeariaPresenter } from "../presenter/barbearia-presenter";

export const buscarBarbeariaId = async (req: Request, res: Response) => {
  const { id } = req.params

  if(!id) {
    return res.status(400).json({
      msg: "O id é obrigatório"
    })
  } 

  
  const barbearia = await prisma.barbearia.findFirst({
    where: {
      id
    }
  })

  if(!barbearia) {
    return res.status(404).json({
      msg: "Barbearia não encontrada"
    })
  }

  // Aqui a gnt retorna a barbearia criada na api
  return res.json({
    barbearia: BarbeariaPresenter.toHttp(barbearia)
  })
}