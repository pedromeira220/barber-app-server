import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "../../errors/api-error";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const updateServiceParamsSchema = z.object(
  {id: z.string().uuid(),}
)

const updateServiceSchema = z.object({
    name: z.string(), 
    priceInCents: z.number(),
    description: z.string(), 
    durationInMinutes: z.number(),
})

export const updateService = async (req: Request, res: Response) => {

  const { id } = updateServiceParamsSchema.parse(req.params)

  const { description, durationInMinutes, name, priceInCents, } = updateServiceSchema.parse(req.body)

  const serviceExists = await prisma.service.findFirst({
    where: {
      id
    }
  })

  if(!serviceExists){
    throw new NotFoundError("Barbearia não encontrada")
  }

   const {id: barbershopId} = getBarbershopIdFromJWT(req)
  
  await prisma.service.update({
    where: {
      id
    },
    data: {
        description,
        durationInMinutes,
        name,
        priceInCents,
        barbershopId
    }
  })

  return res.status(200).end(200)
}
