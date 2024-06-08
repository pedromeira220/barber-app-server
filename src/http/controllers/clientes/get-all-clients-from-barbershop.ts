import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";
import { z } from "zod";

const getAllClientsFromBarbershopParamsSchema = z.object({
  barbershopId: z.string().uuid()
})

export const getAllClientsFromBarbershop = async (req: Request, res: Response) => {

  const {barbershopId} = getAllClientsFromBarbershopParamsSchema.parse(req.params)

  const clients = await prisma.client.findMany({
    where: {
      barbershopId
    }
  })

  return res.json({
    clients: clients
  })
}