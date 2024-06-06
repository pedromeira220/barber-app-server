import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { NotFoundError } from "../../errors/api-error";
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

export const getAuthenticatedProfessional= async (req: Request, res: Response) => {

  const { id } = getBarbershopIdFromJWT(req)
  
  const professional = await prisma.professional.findFirst({
    where: {
      id
    }
  })

  if(!professional) {
    throw new NotFoundError("Profissional não encontrado")
  
  }

  return res.json({
    professional: BarbershopPresenter.toHttp(professional)
  })
}