import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const createServiceBodySchema = z.object({
  name: z.string(), 
  priceInCents: z.number(),
  description: z.string(), 
  durationInMinutes: z.number(),
})

export const createService = async (req: Request, res: Response) => {
  const {description,durationInMinutes,name,priceInCents} = createServiceBodySchema.parse(req.body)

  const {id: barbershopId} = getBarbershopIdFromJWT(req)

  const service = await prisma.service.create({
    data: {
      description,
      durationInMinutes,
      name,
      priceInCents,
      barbershopId
    }
  })

  return res.status(201).end()
}