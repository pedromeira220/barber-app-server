import express from 'express';
import 'express-async-errors'
import { barbershopRouter } from './http/controllers/barbershops/routes';

const app = express()
import cors from 'cors'
import { errorMiddleware } from './http/middlewares/error-middleware';

app.use(cors())

app.use(express.json())
app.use(barbershopRouter)

app.use(errorMiddleware)

export { app }