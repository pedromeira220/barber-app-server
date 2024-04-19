import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { NotFoundError } from "../http/errors/api-error";

const atualizarBarbeariaSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().optional(),
  nomeContato: z.string().optional(),
  telefoneContato: z.string().optional()
})

export const atualizarBarbearia = async (req: Request, res: Response) => {
  // const { id, nome, nomeContato, telefoneContato } = req.body

  const { id, nome, nomeContato, telefoneContato } = atualizarBarbeariaSchema.parse(req.body)

  const barbeariaExiste = await prisma.barbearia.findFirst({
    where: {
      id
    }
  })

  if(!barbeariaExiste){
    throw new NotFoundError("Barbearia não encontrada")
  }

  await prisma.barbearia.update({
    where: {
      id
    },
    data: {
      nome,
      nome_contato: nomeContato,
      telefone_contato: telefoneContato
    }
  })

  return res.send()
}