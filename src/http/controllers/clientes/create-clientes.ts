import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const createClientesBodySchema = z.object({
    name: z.string(),
    phone: z.string(),
})

export const createClientes = async (req: Request, res: Response) => {
  const {phone,name} = createClientesBodySchema.parse(req.body)

  const {id: barbershopId} = getBarbershopIdFromJWT(req)

  const clientes = await prisma.client.create({
    data: {
    phone,
    name,
      barbershopId
    }
  })

  return res.status(201).end()
}