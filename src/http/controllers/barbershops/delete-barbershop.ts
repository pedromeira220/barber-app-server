import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const deleteSchema = z.object({
  id: z.string().uuid()
})

export const deleteBarbershop = async (req: Request, res: Response) => {

  const { id } = deleteSchema.parse(req.params)

  const {id: idFromJwt} = getBarbershopIdFromJWT(req)

  if(id !== idFromJwt) {
    throw new UnauthorizedError("Não tem permissão para deletar a barbearia")
  }

  const barbershopFound = await prisma.barbershop.findFirst({
    where: {
      id
    }
  })

  if(!barbershopFound) {
    throw new NotFoundError("Barbearia não encontrada")
  }

  await prisma.barbershop.delete({
    where: {
      id
    }
  })

  return res.status(201).send()
}