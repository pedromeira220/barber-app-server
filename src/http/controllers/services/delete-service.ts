import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const deleteSchema = z.object({
  id: z.string().uuid()
})

export const deleteService = async (req: Request, res: Response) => {

  const { id } = deleteSchema.parse(req.params)

  const {id: barbershopId} = getBarbershopIdFromJWT(req)

  const serviceFound = await prisma.service.findFirst({
    where: {
      id
    }
  })

  if(!serviceFound) {
    throw new NotFoundError("serviço não encontrado")
  }

  if(serviceFound.barbershopId !== barbershopId) {
    throw new UnauthorizedError("Não tem permissão para deletar esse serviço")
  }

  await prisma.service.delete({
    where: {
      id
    }
  })

  return res.status(201).send()
}