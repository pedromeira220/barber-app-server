import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';

export const logarBarbearia = async (req: Request, res: Response) => {
  const {email, senha} = req.body

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

  const barbeariaEncontrada = await prisma.barbearia.findFirst({
    where: {
      email
    }
  })

  if(!barbeariaEncontrada) {
    return res.status(401).json({
      msg: "Usuário ou senhas incorretos"
    })
  }

  const senhasSaoIguais = await compare(senha, barbeariaEncontrada.hash_senha)

  if(!senhasSaoIguais) {
    return res.status(401).json({
      msg: "Usuário ou senhas incorretos"
    })
  }

  try {
    const secret = process.env.JWT_SECRET || "" // Só para tirar o erro de tipagem
    const token = jwt.sign({
        id: barbeariaEncontrada.id,
    }, secret);

    return res.status(200).json({ barbearia: { email, id: barbeariaEncontrada.id }, token });
} catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Erro interno do servidor" });

}
}