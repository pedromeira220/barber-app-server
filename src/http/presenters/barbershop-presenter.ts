import {Barbershop as PrismaBarbershop} from "@prisma/client"

export class BarbershopPresenter {
  static toHttp(barbershop: PrismaBarbershop) {
    return {
      email: barbershop.email,
      id: barbershop.id,
      name: barbershop.name,
      contactName: barbershop.contact_name,
      contactPhone: barbershop.contact_phone
    }
  }
}