import { Request, Response } from "express";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";

const registerPaymentManuallyBodySchema = z.object({
  date: z.string().datetime(),
  bookingId: z.string().uuid(),
  method: z.enum(["CARD", "PIX", "CASH"])
})

export const registerPaymentManually = async (req: Request, res: Response) => {
  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const {bookingId,date,method} = registerPaymentManuallyBodySchema.parse(req.body)

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId
    },
    include: {
      service: true
    }
  })

  if(!booking) {
    throw new NotFoundError("Booking não encontrado")
  }

  if(booking.barbershopId != barbershopIdFromJwt) {
    throw new UnauthorizedError("Sem permissão pra acessar")
  }

  await prisma.payment.create({
    data: {
      date: new Date(date),
      method,
      valueInCents: booking.service.priceInCents,
      bookingId
    }
  })

  return res.status(201).end()
}