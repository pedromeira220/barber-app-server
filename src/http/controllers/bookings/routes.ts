import { checkToken } from '../../middlewares/check-token';
import { registerBookingManually } from './../bookings/register-booking-manually';
import { Router } from "express";
import { fetchBookingFromAuthBarbershop } from './fetch-bookings-from-auth-barbershop';
import { makeBooking } from './make-booking';

const bookingsRouter = Router()

bookingsRouter.post("/bookings", checkToken, async (req, res) => {
  return registerBookingManually(req, res)
})

bookingsRouter.post("/bookings/client", async (req, res) => {
  return makeBooking(req, res)
})

bookingsRouter.get("/bookings", checkToken, async (req, res) => {
  return fetchBookingFromAuthBarbershop(req, res)
})

export { bookingsRouter }