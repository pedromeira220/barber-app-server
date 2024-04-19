import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { NotFoundError } from "../http/errors/api-error";

const deletarBarbeariaSchema = z.object({
  id: z.string().uuid()
})

export const deletarBarbearia = async (req: Request, res: Response) => {

  const { id } = deletarBarbeariaSchema.parse(req.params)

  const barbeariaEncontrada = await prisma.barbearia.findFirst({
    where: {
      id
    }
  })

  if(!barbeariaEncontrada) {
    throw new NotFoundError("Barbearia não encontrada")
  }


  // Aqui a barbearia é criada no banco de dados
  await prisma.barbearia.delete({
    where: {
      id
    }
  })

  // Aqui a gnt retorna a barbearia criada na api
  return res.status(201).send()
}