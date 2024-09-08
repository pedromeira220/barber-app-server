import { Request, Response } from "express";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";

const getCommissionsParamsSchemaSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0)
})

export const getCommissions = async (req: Request, res: Response) => {
  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const { month, year } = getCommissionsParamsSchemaSchema.parse(req.query)
  
  // Query to get commissions for a specific month and year
  const commissions = await prisma.commission.findMany({
    where: {
      payment: {
        booking: {
          barbershopId: barbershopIdFromJwt
        }
      },
      date: {
        gte: new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`), // Start of the month
        lt: new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-01T00:00:00Z`) // Start of the next month
      }
    },
    include: {
      payment: {
        include: {
          booking: {
            include: {
              professional: true,
              service: true
            }
          }
        }
      }
    }
  });

  // Map the result to the desired format
  const result = commissions.map(c => ({
    id: c.id,
    date: c.date,
    professionalName: c.payment.booking.professional.name,
    serviceName: c.payment.booking.service.name,
    valueInCents: c.payment.valueInCents,
    commissionValueInCents: c.commissionValueInCents,
    commissionPercentage: c.commissionPercentage
  }));

  return res.status(200).json({
    commissions: result
  });
}