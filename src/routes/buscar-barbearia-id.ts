import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { BarbeariaPresenter } from "../presenter/barbearia-presenter";
import { z } from "zod";
import { NotFoundError } from "../http/errors/api-error";

const buscarBarbeariaSchema = z.object({
  id: z.string().uuid()
})

export const buscarBarbeariaId = async (req: Request, res: Response) => {

  const { id } = buscarBarbeariaSchema.parse(req.params)
  
  const barbearia = await prisma.barbearia.findFirst({
    where: {
      id
    }
  })

  if(!barbearia) {

    throw new NotFoundError("Barbearia não encontrada")
   /*  return res.status(404).json({
      msg: "Barbearia não encontrada"
    }) */
  }

  // Aqui a gnt retorna a barbearia criada na api
  return res.json({
    barbearia: BarbeariaPresenter.toHttp(barbearia)
  })
}