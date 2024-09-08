import { Request, Response } from "express";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { NotFoundError, UnauthorizedError } from "../../errors/api-error";

const getPaymentsParamsSchemaSchema = z.object({

})

export const getPayments = async (req: Request, res: Response) => {
  const {id: barbershopIdFromJwt} = getBarbershopIdFromJWT(req)

  const payments = await prisma.$queryRaw`
    SELECT 
      p.id as id,
      p.date as date,
      p.value_in_cents as "valueInCents",
      p.method as method,
      c.name as clientName,
      s.name as serviceName
    FROM payments as p
    LEFT JOIN bookings as b
    ON p.booking_id = b.id
    LEFT JOIN clients as c
    ON b.client_id = c.id
    LEFT JOIN services as s
    ON b.service_id = s.id
    WHERE b.barbershop_id = ${barbershopIdFromJwt}
  `
  
  return res.status(201).json({
    payments
  })
}