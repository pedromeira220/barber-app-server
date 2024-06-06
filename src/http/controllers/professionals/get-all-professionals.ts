import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";

export const getAllProfessional = async (req: Request, res: Response) => {

  const professional = await prisma.barbershop.findMany()

  return res.json({
    barbershops: professional.map(BarbershopPresenter.toHttp)
  })
}