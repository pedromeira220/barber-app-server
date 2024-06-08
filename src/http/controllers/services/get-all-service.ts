import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";

export const getAllService = async (req: Request, res: Response) => {

  const service = await prisma.service.findMany()

  return res.json({
    barbershops: service
  })
}