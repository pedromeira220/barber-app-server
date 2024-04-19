import express from 'express';
import 'express-async-errors'
import { router } from './routes';

const app = express()
import cors from 'cors'
import { errorMiddleware } from './http/middlewares/error-middleware';

app.use(cors())

app.use(express.json())
app.use(router)

app.use(errorMiddleware)

export { app }