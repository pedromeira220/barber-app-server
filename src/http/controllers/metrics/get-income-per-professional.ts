import { prisma } from './../../../database/prisma/prisma';
import { z } from 'zod';
import { getBarbershopIdFromJWT } from './../../provider/get-barbershop-id-from-jwt';
import { Request, Response } from "express";
import { addMonths, startOfMonth } from 'date-fns';

const getIncomePerProfessionalQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0),
});

export const getIncomePerProfessional = async (req: Request, res: Response) => {
  const { month, year } = getIncomePerProfessionalQuerySchema.parse(req.query);

  const firstDayOfMonth: Date = startOfMonth(new Date(year, month - 1));
  const firstDayOfNextMonth: Date = startOfMonth(addMonths(firstDayOfMonth, 1));

  const { id: barbershopIdFromJwt } = getBarbershopIdFromJWT(req);

  // Consulta SQL para obter receita total por profissional
  const result: { professionalId: string, professional: string, income: bigint }[] = await prisma.$queryRaw`
    SELECT 
      p.id AS professionalId,
      p.name AS professional,
      COALESCE(SUM(pay.value_in_cents), 0) / 100 AS income
    FROM 
      payments pay
      JOIN bookings b ON pay."booking_id" = b.id
      JOIN professionals p ON b."professional_id" = p.id
    WHERE 
      pay."date" >= ${firstDayOfMonth} 
      AND pay."date" < ${firstDayOfNextMonth}
      AND b."barbershop_id" = ${barbershopIdFromJwt}
    GROUP BY 
      p.id, p.name
  `;


  return res.status(200).json({
    incomePerProfessional: result.map(r => {
      return {
        professionalId: r.professionalId, professional: r.professional, income: Number(r.income)
      }
    })
  });
};
