import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { BarbeariaPresenter } from "../presenter/barbearia-presenter";

export const buscarTodasBarbearias = async (req: Request, res: Response) => {

  const barbearias = await prisma.barbearia.findMany()

  return res.json({
    barbearias: barbearias.map(BarbeariaPresenter.toHttp)
  })
}