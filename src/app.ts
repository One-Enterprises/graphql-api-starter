import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(helmet())
app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(cors())
}

export default app
