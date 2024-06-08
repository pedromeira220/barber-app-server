import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

export const getAllClients = async (req: Request, res: Response) => {

  const clients = await prisma.client.findMany()

  return res.json({
    clients: clients
  })
}