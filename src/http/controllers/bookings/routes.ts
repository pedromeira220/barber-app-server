import { checkToken } from '../../middlewares/check-token';
import { registerBookingManually } from './../bookings/register-booking-manually';
import { Router } from "express";

const bookingsRouter = Router()

bookingsRouter.post("/bookings", checkToken, async (req, res) => {
  return registerBookingManually(req, res)
})

export { bookingsRouter }