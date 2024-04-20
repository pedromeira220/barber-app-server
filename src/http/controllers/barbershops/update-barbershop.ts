import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError } from "../../errors/api-error";

const updateBarbershopSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional()
})

export const updateBarbershop = async (req: Request, res: Response) => {

  const { id, name, contactName, contactPhone } = updateBarbershopSchema.parse(req.body)

  const barbershopExists = await prisma.barbershop.findFirst({
    where: {
      id
    }
  })

  if(!barbershopExists){
    throw new NotFoundError("Barbearia não encontrada")
  }

  await prisma.barbershop.update({
    where: {
      id
    },
    data: {
      name,
      contact_name: contactName,
      contact_phone: contactPhone
    }
  })

  return res.send()
}