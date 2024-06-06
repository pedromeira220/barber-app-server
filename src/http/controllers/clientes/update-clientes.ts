import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "../../errors/api-error";

const updateClientParamsSchema = z.object(
  {id: z.string().uuid(),}
)

const updateClientSchema = z.object({
    name: z.string(),
    phone: z.number(),
})

export const updateClient = async (req: Request, res: Response) => {

  const { id } = updateClientParamsSchema.parse(req.params)

  const { phone, name, } = updateClientSchema.parse(req.body)

  const clientExists = await prisma.client.findFirst({
    where: {
      id
    }
  })

  if(!clientExists){
    throw new NotFoundError("professional não encontrado")
  }

  
  await prisma.professional.update({
    where: {
      id
    },
    data: {
    name,
    phone,
    }
  })

  return res.send()
}
