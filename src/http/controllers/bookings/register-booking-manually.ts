import { Request, Response } from "express";
import { prisma } from "../../../database/prisma/prisma";
import { hash } from 'bcryptjs'
import { BarbershopPresenter } from "../../presenters/barbershop-presenter";
import { z } from "zod";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { BadRequestError, NotFoundError } from "../../errors/api-error";
import {addMinutes, getMinutes, setSeconds, setMilliseconds, differenceInMinutes} from "date-fns"
import { Booking as PrismaBooking } from "@prisma/client";

const registerBookingManuallySchema = z.object({
  date: z.string().datetime(),
  serviceId: z.string().uuid(),
  clientId: z.string().uuid(),
  observations: z.string().optional(),
  professionalId: z.string().uuid()
})

/**
  Regras de negócio:
  [] Não pode ter agendamentos com horários sobrepostos com o mesmo profissional
  [] Um cliente não pode ter agendamentos com horários sobrepostos
  [x] Um agendamento precisa ter no mínimo 10 minutos
  [x] Os agendamentos precisam seguir uma escala fixa de 10 em 10 minutos
  
  Requisito não funcional:
  - A data final do agendamento é soma da duração do serviço com a data inicial
 */

const BOOKING_INTERVAL_IN_MINUTES = 30

export const registerBookingManually = async (req: Request, res: Response) => {

  const {clientId,date,observations,serviceId, professionalId} = registerBookingManuallySchema.parse(req.body)

  const {id: barbershopId} = getBarbershopIdFromJWT(req)

  const service = await prisma.service.findFirst({
    where: {
      id: serviceId
    }
  })

  if(!service) {
    throw new NotFoundError("Serviço não encontrado")
  }

  const client = await prisma.client.findFirst({
    where: {
      id: clientId
    }
  })

  if(!client) {
    throw new NotFoundError("Cliente não encontrado")
  }

  const professional = await prisma.professional.findFirst({
    where: {
      id: professionalId
    }
  })

  if(!professional) {
    throw new NotFoundError("Profissional não encontrado")
  }

  if(!isValidBooking(new Date(date))) {
    throw new BadRequestError(`Horário inválido. Os agendamentos devem ser marcados a cada ${BOOKING_INTERVAL_IN_MINUTES} minutos.`)
  }

  const bookingDate = zeroOutSecondsAndMilliseconds(date)

  const bookingStartDate = bookingDate
  const bookingEndDate = addMinutes(bookingStartDate, service.durationInMinutes)

  if(differenceInMinutes(bookingEndDate, bookingStartDate) < BOOKING_INTERVAL_IN_MINUTES) {
    throw new BadRequestError(`Um agendamento precisa ter no mínimo ${BOOKING_INTERVAL_IN_MINUTES} minutos`)
  }

  // const conflictingBookingsRaw = await prisma.$queryRaw<PrismaBooking[]>`
  //   SELECT * 
  //   FROM bookings
  //   WHERE (${bookingStartDate} > start_date AND ${bookingEndDate} > start_date)
  //   OR (${bookingStartDate} < start_date AND ${bookingEndDate} < end_date)
  // `

  // if(conflictingBookingsRaw.length == 0) {
   
  // }

  await prisma.booking.create({
    data: {
      endDate: bookingEndDate,
      startDate: bookingStartDate,
      serviceId,
      barbershopId,
      clientId,
      professionalId
    }
  })
  

  return res.json({
    date,
    bookingDate,
    bookingEndDate,
    observations
  })
}

const zeroOutSecondsAndMilliseconds = (isoDateString: string) => {
  let date = new Date(isoDateString);

  date = setSeconds(date, 0);

  date = setMilliseconds(date, 0);

  return date
}

const isValidBooking = (date: Date) => {
  const minutes = getMinutes(date)
  return minutes % BOOKING_INTERVAL_IN_MINUTES === 0;

}