import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";
import { z } from "zod";

const getAllProfessionalFromBarbershopSchemaParmas = z.object({
  barbershopId: z.string().uuid()
})

export const getAllProfessionalFromBarbershop = async (req: Request, res: Response) => {

  const {barbershopId} = getAllProfessionalFromBarbershopSchemaParmas.parse(req.params)

  const professionals = await prisma.professional.findMany({
    where: {
      barbershopId
    }
  })

  return res.json({
    professionals: professionals.map(ProfessionalPresenter.toHttp)
  })
}