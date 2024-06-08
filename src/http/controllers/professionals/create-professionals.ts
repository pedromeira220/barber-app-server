import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const createProfessionalBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    cpf: z.string(),
})

export const createProfessional = async (req: Request, res: Response) => {
  const {email,phone,name,cpf} = createProfessionalBodySchema.parse(req.body)

  console.log("aqui");
  

  const {id: barbershopId} = getBarbershopIdFromJWT(req)

  const professional = await prisma.professional.create({
    data: {
      email,
      phone,
      name,
      cpf,
      barbershopId
    }
  })

  return res.status(201).end()
}