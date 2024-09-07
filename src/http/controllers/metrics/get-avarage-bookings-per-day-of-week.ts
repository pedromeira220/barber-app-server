import { prisma } from '../../../database/prisma/prisma';
import { z } from 'zod';
import { getBarbershopIdFromJWT } from '../../provider/get-barbershop-id-from-jwt';
import { Request, Response } from "express";
import { addMonths, startOfMonth, getDay, differenceInCalendarDays } from 'date-fns';

const getAverageBookingsPerDayOfWeekSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0),
});

export const getAverageBookingsPerDayOfWeek = async (req: Request, res: Response) => {
  const { month, year } = getAverageBookingsPerDayOfWeekSchema.parse(req.query);

  const firstDayOfMonth: Date = startOfMonth(new Date(year, month - 1));
  const firstDayOfNextMonth: Date = startOfMonth(addMonths(firstDayOfMonth, 1));

  const { id: barbershopIdFromJwt } = getBarbershopIdFromJWT(req);

  // Consulta para obter todos os agendamentos no intervalo de datas especificado
  const bookings = await prisma.booking.findMany({
    where: {
      startDate: {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      },
      barbershopId: barbershopIdFromJwt,
    },
    select: {
      startDate: true,
    },
  });

  // Mapeia os agendamentos para o dia da semana
  const bookingsByDayOfWeek = bookings.reduce((acc, booking) => {
    const dayOfWeek = getDay(booking.startDate); // 0 é Domingo, 1 é Segunda, etc.
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1; // Conta agendamentos por dia da semana
    return acc;
  }, {});

  // Calcula o número de dias da semana no intervalo
  const daysInMonth = Array.from({ length: 7 }, (_, i) => i); // Dias da semana de 0 (Domingo) a 6 (Sábado)
  const daysCountByWeekday = daysInMonth.reduce((acc, day) => {
    acc[day] = 0;
    for (let d = firstDayOfMonth; d < firstDayOfNextMonth; d.setDate(d.getDate() + 1)) {
      if (getDay(new Date(d)) === day) {
        acc[day]++;
      }
    }
    return acc;
  }, {});

  // Calcula a média de agendamentos por dia da semana
  const averageBookingsPerDayOfWeek = daysInMonth.map((day) => {
    const totalBookings = bookingsByDayOfWeek[day] || 0;
    const numDays = daysCountByWeekday[day] || 1; // Certifica que não dividimos por 0
    const averageBookings = totalBookings / numDays;
    return {
      dayOfWeek: day,
      averageBookings: averageBookings, // Formata para 2 casas decimais
    };
  });

  return res.status(200).json({
    averageBookingsPerDayOfWeek,
  });
};
