import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";

const fetchBookingFromAuthBarbershopQuerySchema = z.object({
  professionalName: z.string().optional(),
  serviceName: z.string().optional(),
  date: z.string().datetime().optional(),
})

export const fetchBookingFromAuthBarbershop = async (req: Request, res: Response) => {

  const {date,professionalName,serviceName} = fetchBookingFromAuthBarbershopQuerySchema.parse(req.query)

  const {id: barbershopId} = getBarbershopIdFromJWT(req)

  const bookings = await prisma.booking.findMany({
    where: {
      barbershopId,
      professional: {
        name: professionalName
      },
      service: {
        name: serviceName
      },
      startDate: date
    },
    include: {
      client: true,
      professional: true,
      service: true
    }
  })

  // TODO: ordenar os agendamentos

  return res.status(200).json({
    bookings
  })
}