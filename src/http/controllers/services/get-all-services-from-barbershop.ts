import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";
import { z } from "zod";

const getAllServicesFromBarbershopSchemaParmas = z.object({
  barbershopId: z.string().uuid()
})

export const getAllServicesFromBarbershop = async (req: Request, res: Response) => {

  const {barbershopId} = getAllServicesFromBarbershopSchemaParmas.parse(req.params)

  const services = await prisma.service.findMany({
    where: {
      barbershopId
    }
  })

  return res.json({
    professionals: services
  })
}