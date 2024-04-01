import express from 'express';
import 'express-async-errors'
import { router } from './routes';

const app = express()
import cors from 'cors'

app.use(cors())

app.use(express.json())
app.use(router)

export { app }