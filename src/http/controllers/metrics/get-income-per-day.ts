import { prisma } from './../../../database/prisma/prisma';
import { z } from 'zod';
import { getBarbershopIdFromJWT } from './../../provider/get-barbershop-id-from-jwt';
import { Request, Response } from "express";
import { addMonths, startOfMonth, subMonths } from 'date-fns';

const getIncomePerDayQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0)
})

/*
 [] para todos precisa ter a diferença em % do período anterior

  [x] receita total
  [x] ticket médio geral
  [x] serviços efetuados
*/

export const getIncomePerDay = async (req: Request, res: Response) => {
  const { month, year } = getIncomePerDayQuerySchema.parse(req.query)
  
  const firstDayOfMonth: Date = startOfMonth(new Date(year, month - 1));
  const firstDayOfNextMonth: Date = startOfMonth(addMonths(firstDayOfMonth, 1));

  console.log({
    firstDayOfMonth,
    firstDayOfNextMonth
  });
  
  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const result = await prisma.payment.groupBy({
    by: "date",
    _sum: {
      valueInCents: true
    }
  }) 

  const incomePerDay = result.map(result => {
    return {
      date: result.date,
      income: (result._sum.valueInCents ?? 0) / 100
    }
  })
  

 return res.status(200).json({
    incomePerDay
 })
}