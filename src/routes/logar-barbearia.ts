import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { InternalServerError, UnauthorizedError } from "../http/errors/api-error";

const logarBarbeariaSchema = z.object({
  email: z.string().email(),
  senha: z.string()
})

export const logarBarbearia = async (req: Request, res: Response) => {
  const {email, senha} = logarBarbeariaSchema.parse(req.body)

  const barbeariaEncontrada = await prisma.barbearia.findFirst({
    where: {
      email
    }
  })

  if(!barbeariaEncontrada) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  const senhasSaoIguais = await compare(senha, barbeariaEncontrada.hash_senha)

  if(!senhasSaoIguais) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  try {
    const secret = process.env.JWT_SECRET || "" // Só para tirar o erro de tipagem
    const token = jwt.sign({
        id: barbeariaEncontrada.id,
    }, secret);

    return res.status(200).json({ barbearia: { email, id: barbeariaEncontrada.id }, token });
} catch (error) {
    console.log(error);
    throw new InternalServerError("Erro interno do servidor")

}
}