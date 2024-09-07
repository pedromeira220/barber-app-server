import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { registerPaymentManually } from "./register-payment-manually";

const paymentRouter = Router()

paymentRouter.post("/payment", checkToken, (req, res) => {
  return registerPaymentManually(req, res)
})

export { paymentRouter }