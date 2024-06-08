import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const deleteSchema = z.object({
  id: z.string().uuid()
})

export const deleteClient = async (req: Request, res: Response) => {

  const { id } = deleteSchema.parse(req.params)

  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const clientFound = await prisma.client.findFirst({
    where: {
      id
    }
  })

  if(!clientFound) {
    throw new NotFoundError("cliente não encontrado")
  }

  if(clientFound.barbershopId !== barbershopIdFromJwt) {
    throw new UnauthorizedError("Não tem permissão para deletar esse cliente")
  }

  await prisma.client.delete({
    where: {
      id
    }
  })

  return res.status(204).send()
}