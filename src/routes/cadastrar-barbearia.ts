import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hash } from 'bcryptjs'

export const cadastrarBarbearia = async (req: Request, res: Response) => {
  const {nome, email, senha} = req.body

  if(!nome) {
    return res.status(400).json({
      msg: "O nome é obrigatório"
    })
  } // TODO: Fazer essa verificação para cada parâmetro de criação de uma barbearia (fazer mais para o email e a senha)

  // A gnt precisa fazer o hash da senha
  const hashDaSenha = await hash(senha, 6)

  // Aqui a barbearia é criada no banco de dados
  const barbearia = prisma.barbearia.create({
    data: {
      email,
      hash_senha: hashDaSenha, 
      nome
    }
  })

  // Aqui a gnt retorna na api a barbearia
  return res.json({
    barbearia
  })
}