import { getAverageBookingsPerDayOfWeek } from './get-avarage-bookings-per-day-of-week';
import { checkToken } from '../../middlewares/check-token';
import { getIncomePerDay } from './get-income-per-day';
import { getIncomePerProfessional } from './get-income-per-professional';
import { getMetrics } from './get-metrics';
import { Router } from "express";
import {  getProfessionalIncome } from './get-professional-income';
import { getBarbershopIncomePerProfessional } from './get-barbershop-income-per-professional';

const metricsRouter = Router()

metricsRouter.get("/metrics", checkToken, async (req, res) => {
  return getMetrics(req, res)
})

metricsRouter.get("/metrics/income-per-day", checkToken, async (req, res) => {
  return getIncomePerDay(req, res)
})

metricsRouter.get("/metrics/income-per-professional", checkToken, async (req, res) => {
  return getIncomePerProfessional(req, res)
})

metricsRouter.get("/metrics/average-bookings-per-day-of-week", checkToken, async (req, res) => {
  return getAverageBookingsPerDayOfWeek(req, res)
})

metricsRouter.get("/metrics/professional-income", checkToken, async (req, res) => {
  return getProfessionalIncome(req, res)
})

metricsRouter.get("/metrics/barbershop-income-per-professional", checkToken, async (req, res) => {
  return getBarbershopIncomePerProfessional(req, res)
})

export { metricsRouter }