import express from 'express';
import 'express-async-errors'
import { barbershopRouter } from './http/controllers/barbershops/routes';
import { bookingsRouter } from './http/controllers/bookings/routes';

import cors from 'cors'
import { errorMiddleware } from './http/middlewares/error-middleware';
import { serviceRouter } from './http/controllers/services/routes';
import { professionalRouter } from './http/controllers/professionals/routes';
import { clientesRouter } from './http/controllers/clientes/routes';
import { metricsRouter } from './http/controllers/metrics/routes';
import { paymentRouter } from './http/controllers/payment/routes';

const app = express()

app.use(cors())

app.use(express.json())
app.use(barbershopRouter)
app.use(bookingsRouter)
app.use(serviceRouter)
app.use(professionalRouter)
app.use(clientesRouter)
app.use(metricsRouter)
app.use(paymentRouter)

app.use(errorMiddleware)

export { app }