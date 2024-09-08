import { Request, Response } from "express";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { startOfMonth, addMonths } from "date-fns";

// Define o esquema de validação para os parâmetros de entrada
const getGrossRevenueParamsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0)
});

// Função para buscar a receita bruta de cada profissional
export const getBarbershopIncomePerProfessional = async (req: Request, res: Response) => {
  // Extrai e valida os parâmetros de entrada (mês e ano)
  const { month, year } = getGrossRevenueParamsSchema.parse(req.query);

  // Calcula o primeiro dia do mês e o primeiro dia do próximo mês
  const firstDayOfMonth: Date = startOfMonth(new Date(year, month - 1));
  const firstDayOfNextMonth: Date = startOfMonth(addMonths(firstDayOfMonth, 1));

  // Obtém o ID da barbearia a partir do token JWT do usuário autenticado
  const { id: barbershopIdFromJwt } = getBarbershopIdFromJWT(req);

  try {
    // Busca os profissionais e calcula a receita bruta de cada um
    const professionalsWithGrossRevenue = await prisma.professional.findMany({
      where: {
        barbershopId: barbershopIdFromJwt,
      },
      include: {
        Booking: {
          where: {
            startDate: {
              gte: firstDayOfMonth,
              lt: firstDayOfNextMonth,
            },
            barbershopId: barbershopIdFromJwt,
          },
          include: {
            Payment: true,
          },
        },
      },
    });

    // Mapeia os dados para incluir o total de receita bruta por profissional
    const result = professionalsWithGrossRevenue.map((professional) => {
      // Calcula a receita bruta total baseada nos pagamentos associados às reservas do profissional
      const totalGrossRevenueInCents = professional.Booking.reduce((acc, booking) => {
        const bookingRevenue = booking.Payment.reduce(
          (sum, payment) => sum + payment.valueInCents,
          0
        );
        return acc + bookingRevenue;
      }, 0);

      return {
        professionalId: professional.id,
        professionalName: professional.name,
        totalGrossRevenueInCents,
      };
    });

    // Retorna o resultado com status 200
    return res.status(200).json({
      professionals: result,
    });
  } catch (error) {
    console.error("Error fetching gross revenues:", error);
    return res.status(500).json({ error: "Erro ao buscar receita bruta dos profissionais." });
  }
};
