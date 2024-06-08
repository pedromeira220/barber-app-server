import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { z } from "zod";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../errors/api-error";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";

const updateProfessionalParamsSchema = z.object(
  {id: z.string().uuid(),}
)

const updateProfessionalSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    cpf:   z.string().optional(),
})

export const updateProfessional = async (req: Request, res: Response) => {

  const { id } = updateProfessionalParamsSchema.parse(req.params)

  const { email, phone, name, cpf, } = updateProfessionalSchema.parse(req.body)

  const professionalExists = await prisma.professional.findFirst({
    where: {
      id
    }
  })

  if(!professionalExists){
    throw new NotFoundError("professional não encontrado")
  }

   const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

   if(professionalExists.barbershopId !== barbershopIdFromJwt) {
    throw new UnauthorizedError("Não tem permissão para atualizar esse profissional")
   }
  
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

  return res.status(200).end()
}
