import express from 'express';
import 'express-async-errors'
import { barbershopRouter } from './http/controllers/barbershops/routes';
import { bookingsRouter } from './http/controllers/bookings/routes';

import cors from 'cors'
import { errorMiddleware } from './http/middlewares/error-middleware';

const app = express()

app.use(cors())

app.use(express.json())
app.use(barbershopRouter)
app.use(bookingsRouter)

app.use(errorMiddleware)

export { app }