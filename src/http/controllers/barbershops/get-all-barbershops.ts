import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";

export const getAllBarbershops = async (req: Request, res: Response) => {

  const barbershops = await prisma.barbershop.findMany()

  return res.json({
    barbershops: barbershops.map(BarbershopPresenter.toHttp)
  })
}