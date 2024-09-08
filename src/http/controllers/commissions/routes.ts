import { Router } from "express";
import { checkToken } from "../../middlewares/check-token";
import { getIncomeMetrics } from "./get-income-metrics";
import { getCommissions } from "./get-commissions";

const commissionsRouter = Router()

commissionsRouter.get("/commissions/income-metrics", checkToken, async (req, res) => {
  return getIncomeMetrics(req, res)
})

commissionsRouter.get("/commissions", checkToken, async (req, res) => {
  return getCommissions(req, res)
})

export {commissionsRouter}