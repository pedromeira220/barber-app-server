import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

export const getAllProfessional = async (req: Request, res: Response) => {

  const professionals = await prisma.professional.findMany()

  return res.json({
    professionals: professionals.map(ProfessionalPresenter.toHttp)
  })
}