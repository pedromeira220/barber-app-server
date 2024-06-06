import { prisma } from "../../../database/prisma/prisma";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';
import { z } from "zod";
import { InternalServerError, UnauthorizedError } from "../../errors/api-error";
import { env } from "../../../env";
import { response } from "express";

const loginProfessionalSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const loginService = async (req: Request, res: Response) => {
  const {email, password} = loginProfessionalSchema.parse(req.body)

  const ProfessionalFound = await prisma.professional.findFirst({
    where: {
      email
    }
  })

  if(!ProfessionalFound) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  const passwordsMatch = await compare(password, ProfessionalFound.password_hash)

  if(!passwordsMatch) {
    throw new UnauthorizedError("Usuário ou senhas incorretos")
  }

  try {
    const secret = env.JWT_SECRET
    const token = jwt.sign({
        id: ProfessionalFound.id,
    }, secret, {
      subject: ProfessionalFound.id
    });

    return response.status(200).json({ barbershop: { email, id: ProfessionalFound.id }, token });
  } catch (error) {
    console.log(error);
    throw new InternalServerError("Erro interno do servidor")
  }
}
