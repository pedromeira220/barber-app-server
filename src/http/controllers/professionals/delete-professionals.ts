import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const deleteSchema = z.object({
  id: z.string().uuid()
})

export const deleteProfessional = async (req: Request, res: Response) => {

  const { id } = deleteSchema.parse(req.params)

  const {id: idFromJwt} = getBarbershopIdFromJWT(req)

  if(id !== idFromJwt) {
    throw new UnauthorizedError("Não tem permissão para deletar esse profissional")
  }

  const professionalFound = await prisma.professional.findFirst({
    where: {
      id
    }
  })

  if(!professionalFound) {
    throw new NotFoundError("profissional não encontrado")
  }

  await prisma.professional.delete({
    where: {
      id
    }
  })

  return res.status(201).send()
}