import { checkToken } from '../../middlewares/check-token';
import { getMetrics } from './get-metrics';
import { Router } from "express";

const metricsRouter = Router()

metricsRouter.get("/metrics", checkToken, async (req, res) => {
  return getMetrics(req, res)
})

export { metricsRouter }