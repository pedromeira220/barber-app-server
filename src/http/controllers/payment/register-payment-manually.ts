import { Request, Response } from "express";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";

const registerPaymentManuallyBodySchema = z.object({
  date: z.string().datetime(),
  bookingId: z.string().uuid(),
  method: z.enum(["CARD", "PIX", "CASH"]),
  valueInCents: z.number().optional()
})

export const registerPaymentManually = async (req: Request, res: Response) => {
  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const {bookingId,date,method, valueInCents} = registerPaymentManuallyBodySchema.parse(req.body)

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

  const paymentValueInCents = valueInCents ?? booking.service.priceInCents

  const paymentCreated = await prisma.payment.create({
    data: {
      date: new Date(date),
      method,
      valueInCents: paymentValueInCents,
      bookingId
    }
  })

  await prisma.booking.update({
    data: {
      status: "COMPLETED"
    },
    where: {
      id: bookingId
    }
  })

  await prisma.commission.create({
    data: {
      date: new Date(date),
      commissionPercentage: booking.service.commissionPercentage,
      commissionValueInCents: booking.service.commissionPercentage * paymentValueInCents,
      paymentId: paymentCreated.id,
      professionalId: booking.professionalId
    }
  })

  return res.status(201).end()
}