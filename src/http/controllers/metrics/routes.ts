import { checkToken } from '../../middlewares/check-token';
import { getIncomePerDay } from './get-income-per-day';
import { getMetrics } from './get-metrics';
import { Router } from "express";

const metricsRouter = Router()

metricsRouter.get("/metrics", checkToken, async (req, res) => {
  return getMetrics(req, res)
})

metricsRouter.get("/metrics/income-per-day", checkToken, async (req, res) => {
  return getIncomePerDay(req, res)
})

export { metricsRouter }