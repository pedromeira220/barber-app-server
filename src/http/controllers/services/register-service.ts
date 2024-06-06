import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { InternalServerError, UnauthorizedError } from "../../errors/api-error";
import { env } from "../../../env";

const loginServiceSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const loginService = async (req: Request, res: Response) => {
  const {email, password} = loginServiceSchema.parse(req.body)

  const ServiceFound = await prisma.barbershop.findFirst({
    where: {
      email
    }
  })

  if(!ServiceFound) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  const passwordsMatch = await compare(password, ServiceFound.password_hash)

  if(!passwordsMatch) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  try {
    const secret = env.JWT_SECRET
    const token = jwt.sign({
        id: ServiceFound.id,
    }, secret, {
      subject: ServiceFound.id
    });

    return res.status(200).json({ barbershop: { email, id: ServiceFound.id }, token });
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Erro interno do servidor")
  }
}