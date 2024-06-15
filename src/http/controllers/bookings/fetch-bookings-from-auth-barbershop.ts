import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";
import { endOfDay, startOfDay } from "date-fns";

const fetchBookingFromAuthBarbershopQuerySchema = z.object({
  professionalId: z.string().optional(),
  serviceId: z.string().optional(),
  date: z.string().datetime().optional(),
})

export const fetchBookingFromAuthBarbershop = async (req: Request, res: Response) => {

  const { date, professionalId, serviceId } = fetchBookingFromAuthBarbershopQuerySchema.parse(req.query)

  const { id: barbershopId } = getBarbershopIdFromJWT(req)

  let startDateFilter = undefined

  if(!!date) {
    startDateFilter = {
      gte: startOfDay(date),
      lte: endOfDay(date)
    }
  }

  const bookings = await prisma.booking.findMany({
    where: {
      barbershopId,
      professionalId,
      serviceId,
      startDate: startDateFilter
    },
    include: {
      client: true,
      professional: true,
      service: true
    },
    orderBy: [{
      startDate: "asc"
    }]
  })

  // TODO: ordenar os agendamentos

  return res.status(200).json({
    bookings
  })
}