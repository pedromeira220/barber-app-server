import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError } from "../../errors/api-error";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";

const getByIdSchema = z.object({
  id: z.string().uuid()
})

export const getById = async (req: Request, res: Response) => {

  const { id } = getByIdSchema.parse(req.params)
  
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      id
    }
  })

  if(!barbershop) {

    throw new NotFoundError("Barbearia não encontrada")
  
  }

  // Aqui a gnt retorna a barbershop criada na api
  return res.json({
    barbershop: BarbershopPresenter.toHttp(barbershop)
  })
}