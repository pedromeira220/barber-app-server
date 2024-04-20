import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError } from "../../errors/api-error";

const deleteSchema = z.object({
  id: z.string().uuid()
})

export const deleteBarbershop = async (req: Request, res: Response) => {

  const { id } = deleteSchema.parse(req.params)

  const barbershopFound = await prisma.barbershop.findFirst({
    where: {
      id
    }
  })

  if(!barbershopFound) {
    throw new NotFoundError("Barbearia não encontrada")
  }

  await prisma.barbershop.delete({
    where: {
      id
    }
  })

  return res.status(201).send()
}