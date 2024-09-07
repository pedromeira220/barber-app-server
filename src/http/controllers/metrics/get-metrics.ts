import { prisma } from './../../../database/prisma/prisma';
import { z } from 'zod';
import { getBarbershopIdFromJWT } from './../../provider/get-barbershop-id-from-jwt';
import { Request, Response } from "express";
import { addMonths, startOfMonth, subMonths } from 'date-fns';

const getMetricsQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0)
})

/*
 [] para todos precisa ter a diferença em % do período anterior

  [x] receita total
  [x] ticket médio geral
  [x] serviços efetuados
*/

export const getMetrics = async (req: Request, res: Response) => {
  const { month, year } = getMetricsQuerySchema.parse(req.query)
  
  const firstDayOfMonth: Date = startOfMonth(new Date(year, month - 1));
  const firstDayOfNextMonth: Date = startOfMonth(addMonths(firstDayOfMonth, 1));

  console.log({
    firstDayOfMonth,
    firstDayOfNextMonth
  });
  
  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const totalIncomeResult = await prisma.payment.aggregate({
    where: {
      booking: {
        barbershopId: barbershopIdFromJwt
      },
      date: {
        gte: firstDayOfMonth,
        lte: firstDayOfNextMonth
      }
    },
    _sum: {
      valueInCents: true
    }
  })

  const lastMonthTotalIncomeResult = await prisma.payment.aggregate({
    where: {
      booking: {
        barbershopId: barbershopIdFromJwt
      },
      date: {
        gte: subMonths(firstDayOfMonth, 1),
        lte: subMonths(firstDayOfNextMonth, 1)
      }
    },
    _sum: {
      valueInCents: true
    }
  })

  const totalIncomeInCents = totalIncomeResult._sum.valueInCents ?? 0
  const lastMonthTotalIncomeInCents = lastMonthTotalIncomeResult._sum.valueInCents ?? 0

  const completedBookingsCount = await prisma.booking.count({
    where: {
      barbershopId: barbershopIdFromJwt,
      startDate: {
        gte: firstDayOfMonth,
        lte: firstDayOfNextMonth
      },
      status: "COMPLETED"
    }
  })

  const lastMonthCompletedBookingsCount = await prisma.booking.count({
    where: {
      barbershopId: barbershopIdFromJwt,
      startDate: {
        gte: subMonths(firstDayOfMonth, 1),
        lte: subMonths(firstDayOfNextMonth, 1)
      },
      status: "COMPLETED"
    }
  })

  const paymentsCount = await prisma.payment.count({
    where: {
      booking: {
        barbershopId: barbershopIdFromJwt
      },
      date: {
        gte: firstDayOfMonth,
        lte: firstDayOfNextMonth
      }
    }
  }) 

  const lastMonthPaymentsCount = await prisma.payment.count({
    where: {
      booking: {
        barbershopId: barbershopIdFromJwt
      },
      date: {
        gte: subMonths(firstDayOfMonth, 1),
        lte: subMonths(firstDayOfNextMonth, 1)
      }
    }
  }) 

  const averageTicketInCents = totalIncomeInCents / paymentsCount
  const lastMonthAverageTicketInCents = lastMonthTotalIncomeInCents / lastMonthPaymentsCount

  return res.status(200).json({
    totalIncome: {
      totalIncomeInCents,
      diffFromLastMonth: totalIncomeInCents / lastMonthTotalIncomeInCents  - 1,
      lastMonthTotalIncomeInCents
    },
    completedBookings: {
      completedBookingsCount,
      diffFromLastMoth: completedBookingsCount / lastMonthCompletedBookingsCount - 1,
      lastMonthCompletedBookingsCount
    },
    averageTicket: {
      averageTicketInCents,
      diffFromLastMoth: averageTicketInCents / lastMonthAverageTicketInCents - 1,
      lastMonthAverageTicketInCents
    }
  })
}