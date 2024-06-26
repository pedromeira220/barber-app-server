import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { InternalServerError, UnauthorizedError } from "../../errors/api-error";
import { env } from "../../../env";

const loginBarbershopSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const loginBarbershop = async (req: Request, res: Response) => {
  const {email, password} = loginBarbershopSchema.parse(req.body)

  const barbershopFound = await prisma.barbershop.findFirst({
    where: {
      email
    }
  })

  if(!barbershopFound) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  const passwordsMatch = await compare(password, barbershopFound.password_hash)

  if(!passwordsMatch) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  try {
    const secret = env.JWT_SECRET
    const token = jwt.sign({
        id: barbershopFound.id,
    }, secret, {
      subject: barbershopFound.id
    });

    return res.status(200).json({ barbershop: { email, id: barbershopFound.id }, token });
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Erro interno do servidor")
  }
}