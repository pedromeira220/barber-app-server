import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

export const getAllService = async (req: Request, res: Response) => {

  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const services = await prisma.service.findMany({
    where: {
      barbershopId: barbershopIdFromJwt
    }
  })

  return res.json({
    services
  })
}