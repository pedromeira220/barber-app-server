import {Professional as PrismaProfessional} from "@prisma/client"

export class ProfessionalPresenter {
  static toHttp(professional: PrismaProfessional) {
    return {
      barbershopId: professional.barbershopId,
      name: professional.name,
      cpf: professional.cpf,
      email: professional.email,
      id: professional.id,
      phone: professional.phone
    }
  }
}