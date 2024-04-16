import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hash } from 'bcryptjs'
import { BarbeariaPresenter } from "../presenter/barbearia-presenter";

export const cadastrarBarbearia = async (req: Request, res: Response) => {
  const {nome, email, senha, nomeContato, telefoneContato} = req.body

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

  if(!nomeContato) {
    return res.status(400).json({
      msg: "O nomeContato é obrigatório"
    })
  } 

  if(!telefoneContato) {
    return res.status(400).json({
      msg: "O telefoneContato é obrigatório"
    })
  } 

  const hashDaSenha = await hash(senha, 6)

  const barbearia = await prisma.barbearia.create({
    data: {
      email,
      hash_senha: hashDaSenha, 
      nome,
      nome_contato: nomeContato,
      telefone_contato: telefoneContato
    }
  })

  return res.json({
    barbearia: BarbeariaPresenter.toHttp(barbearia)
  })
}