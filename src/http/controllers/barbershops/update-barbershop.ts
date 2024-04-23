import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError } from "../../errors/api-error";

const updateBarbershopParamsSchema = z.object(
  {id: z.string().uuid(),}
)

const updateBarbershopSchema = z.object({
  name: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  email: z.string().optional(),
})

export const updateBarbershop = async (req: Request, res: Response) => {

  const { id } = updateBarbershopParamsSchema.parse(req.params)

  const { name, contactName, contactPhone, email } = updateBarbershopSchema.parse(req.body)

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
      contact_phone: contactPhone,
      email
    }
  })

  return res.send()
}