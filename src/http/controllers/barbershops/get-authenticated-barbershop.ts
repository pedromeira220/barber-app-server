import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { NotFoundError } from "../../errors/api-error";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

export const getAuthenticatedBarbershop = async (req: Request, res: Response) => {

  const { id } = getBarbershopIdFromJWT(req)
  
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      id
    }
  })

  if(!barbershop) {
    throw new NotFoundError("Barbearia não encontrada")
  
  }

  return res.json({
    barbershop: BarbershopPresenter.toHttp(barbershop)
  })
}