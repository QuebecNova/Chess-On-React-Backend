import express from 'express'
import 'express-async-errors'
import { authRouter } from './routes/auth'
import cookieSession from 'cookie-session'
import { currentUser } from './middlewares/currentUser'
import { NotFoundError } from './errors/NotFound'
import { errorHandler } from './middlewares/errorHandler'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'
import cors from 'cors'

export const app = express()

app.use(cors())

app.options('*', cors())

app.use(helmet())

app.set('trust proxy', true)

const limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP. Try again in 1 hour',
})

app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))

app.use(ExpressMongoSanitize())

app.use(xss())

app.use(
    hpp({
        whitelist: []
    })
)

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
)

app.use(currentUser)

app.use('/api/v1/users', authRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError(req.originalUrl)
})

app.use(errorHandler)
