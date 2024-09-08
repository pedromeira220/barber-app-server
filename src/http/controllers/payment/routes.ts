import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { registerPaymentManually } from "./register-payment-manually";
import { getPayments } from "./get-payments";

const paymentRouter = Router()

paymentRouter.post("/payments", checkToken, (req, res) => {
  return registerPaymentManually(req, res)
})

paymentRouter.get("/payments", checkToken, (req, res) => {
  return getPayments(req, res)
})

export { paymentRouter }