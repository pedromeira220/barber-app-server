import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hash } from 'bcryptjs'
import { BarbeariaPresenter } from "../presenter/barbearia-presenter";
import { z } from "zod";

const cadastrarBarbeariaSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  senha: z.string(),
  nomeContato: z.string(),
  telefoneContato: z.string()
})

export const cadastrarBarbearia = async (req: Request, res: Response) => {


  const {nome, email, senha, nomeContato, telefoneContato} = cadastrarBarbeariaSchema.parse(req.body)


  const hashDaSenha = await hash(senha, 6)

  const barbearia = await prisma.barbearia.create({
    data: {
      email,
      hash_senha: hashDaSenha, 
      nome,
      nome_contato: nomeContato,
      telefone_contato: telefoneContato
    }
  })

  return res.json({
    barbearia: BarbeariaPresenter.toHttp(barbearia)
  })
}