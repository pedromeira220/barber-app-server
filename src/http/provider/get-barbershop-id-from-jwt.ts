import { Request } from "express";
import { InternalServerError } from "../errors/api-error";

export const getBarbershopIdFromJWT = (req: any) => {
  if(!req.barbershopId) {
    console.log("> barbershopId não presente na request");
    throw new InternalServerError("Erro interno do servidor")
  }

  return {
    id: req.barbershopId as string
  }
}