import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hash } from 'bcryptjs'

export const cadastrarBarbearia = async (req: Request, res: Response) => {
  const {nome, email, senha} = req.body

  if(!nome) {
    return res.status(400).json({
      msg: "O nome é obrigatório"
    })
  } 

  if(!email) {
    return res.status(400).json({
      msg: "O email é obrigatório"
    })
  } 

  if(!senha) {
    return res.status(400).json({
      msg: "A senha é obrigatória"
    })
  } 

  const hashDaSenha = await hash(senha, 6)

  // Aqui a barbearia é criada no banco de dados
  const barbearia = await prisma.barbearia.create({
    data: {
      email,
      hash_senha: hashDaSenha, 
      nome
    }
  })

  // Aqui a gnt retorna a barbearia criada na api
  return res.json({
    barbearia
  })
}