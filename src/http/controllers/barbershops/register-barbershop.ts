import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { hash } from 'bcryptjs'
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { z } from "zod";

const registerBarbershopSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  contactName: z.string(),
  contactPhone: z.string()
})

export const registerBarbershop = async (req: Request, res: Response) => {

  const {name, email, password, contactName, contactPhone} = registerBarbershopSchema.parse(req.body)


  const passwordHash = await hash(password, 6)

  const barbershop = await prisma.barbershop.create({
    data: {
      email,
      password_hash: passwordHash, 
      name,
      contact_name: contactName,
      contact_phone: contactPhone
    }
  })

  return res.json({
    barbershop: BarbershopPresenter.toHttp(barbershop)
  })
}