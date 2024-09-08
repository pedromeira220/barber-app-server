import { prisma } from './../../../database/prisma/prisma';
import { z } from 'zod';
import { getBarbershopIdFromJWT } from './../../provider/get-barbershop-id-from-jwt';
import { Request, Response } from "express";
import { addMonths, startOfMonth, subMonths } from 'date-fns';

const getIncomeMetricsQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0)
})

export const getIncomeMetrics = async (req: Request, res: Response) => {
  const { month, year } = getIncomeMetricsQuerySchema.parse(req.query)
  
  const firstDayOfMonth: Date = startOfMonth(new Date(year, month - 1));
  const firstDayOfNextMonth: Date = startOfMonth(addMonths(firstDayOfMonth, 1));
  
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

  const totalIncomeInCents = totalIncomeResult._sum.valueInCents ?? 0

  const totalProfessionalIncomeResult = await prisma.commission.aggregate({
    where: {
      payment: {
        booking: {
          barbershopId: barbershopIdFromJwt
        },
      },
      date: {
        gte: firstDayOfMonth,
        lte: firstDayOfNextMonth
      }
    },
    _sum: {
      commissionValueInCents: true
    }
  })

  const totalProfessionalIncomeInCents = totalProfessionalIncomeResult._sum.commissionValueInCents ?? 0

  return res.status(200).json({
    totalIncomeInCents,
    totalProfessionalIncomeInCents,
    netIncome: totalIncomeInCents - totalProfessionalIncomeInCents
  })
}