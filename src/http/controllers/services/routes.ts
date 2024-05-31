import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { createService } from "./create-service";

const serviceRouter = Router()

serviceRouter.post("/services", checkToken, async (req, res) => {
  return createService(req, res)
})


export {serviceRouter}