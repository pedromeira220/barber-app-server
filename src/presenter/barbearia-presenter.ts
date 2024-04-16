import {Barbearia as PrismaBarbearia} from "@prisma/client"

export class BarbeariaPresenter {
  static toHttp(barbearia: PrismaBarbearia) {
    return {
      email: barbearia.email,
      id: barbearia.id,
      nome: barbearia.nome,
      nomeContato: barbearia.nome_contato,
      telefoneContato: barbearia.telefone_contato
    }
  }
}