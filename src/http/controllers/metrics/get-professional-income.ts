import { Request, Response } from "express";
import { getBarbershopIdFromJWT } from "../../provider/get-barbershop-id-from-jwt";
import { z } from "zod";
import { prisma } from "../../../database/prisma/prisma";
import { startOfMonth, addMonths } from "date-fns";

// Define o esquema de validação para os parâmetros de entrada
const getProfessionalIncomeParamsSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(0)
});

// Função para buscar a receita de cada profissional
export const getProfessionalIncome = async (req: Request, res: Response) => {
  // Extrai e valida os parâmetros de entrada (mês e ano)
  const { month, year } = getProfessionalIncomeParamsSchema.parse(req.query);

  // Calcula o primeiro dia do mês e o primeiro dia do próximo mês
  const firstDayOfMonth: Date = startOfMonth(new Date(year, month - 1));
  const firstDayOfNextMonth: Date = startOfMonth(addMonths(firstDayOfMonth, 1));

  // Obtém o ID da barbearia a partir do token JWT do usuário autenticado
  const { id: barbershopIdFromJwt } = getBarbershopIdFromJWT(req);

  try {
    // Busca os profissionais e calcula a receita de cada um
    const professionalsWithIncome = await prisma.professional.findMany({
      where: {
        barbershopId: barbershopIdFromJwt,
      },
      include: {
        Commission: {
          where: {
            date: {
              gte: firstDayOfMonth,
              lt: firstDayOfNextMonth,
            },
          },
          select: {
            commissionValueInCents: true,
          },
        },
      },
    });

    // Mapeia os dados para incluir o total de receita por profissional
    const result = professionalsWithIncome.map((professional) => {
      const totalIncomeInCents = professional.Commission.reduce(
        (acc, commission) => acc + commission.commissionValueInCents,
        0
      );

      return {
        professionalId: professional.id,
        professionalName: professional.name,
        totalIncomeInCents,
      };
    });

    // Retorna o resultado com status 200
    return res.status(200).json({
      professionals: result,
    });
  } catch (error) {
    console.error("Error fetching professional incomes:", error);
    return res.status(500).json({ error: "Erro ao buscar receita dos profissionais." });
  }
};
