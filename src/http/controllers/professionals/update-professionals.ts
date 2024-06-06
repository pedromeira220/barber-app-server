import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "../../errors/api-error";

const updateProfessionalParamsSchema = z.object(
  {id: z.string().uuid(),}
)

const updateProfessionalSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.number(),
    cpf:   z.number(),
})

export const updateProfessional = async (req: Request, res: Response) => {

  const { id } = updateProfessionalParamsSchema.parse(req.params)

  const { email, phone, name, cpf, } = updateProfessionalSchema.parse(req.body)

  const ProfessionalExists = await prisma.professional.findFirst({
    where: {
      id
    }
  })

  if(!ProfessionalExists){
    throw new NotFoundError("professional não encontrado")
  }

   const {id: barbershopId} = getBarbershopIdFromJWT(req)
  
  await prisma.professional.update({
    where: {
      id
    },
    data: {
    name,
    email,
    phone,
    cpf,
    }
  })

  return res.send()
}
