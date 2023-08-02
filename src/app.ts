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
import morgan from 'morgan'

export const app = express()

app.use(morgan('dev'))

app.use(cors())

app.options(process.env.FRONTEND_CORS_DOMAIN!, cors())

app.use(helmet())

if (process.env.NODE_ENV === 'prod') {
    const limiter = rateLimit({
        max: 300,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests from this IP. Try again in 1 hour',
    })

    app.use('/api', limiter)
}

app.use(express.json({ limit: '10kb' }))

app.use(ExpressMongoSanitize())

app.use(xss())

app.use(
    hpp({
        whitelist: [],
    })
)

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
        maxAge: parseInt(process.env.COOKIE_EXPIRES_IN_DAYS || '14') * 24 * 60 * 60 * 1000,
    })
)

app.use(currentUser)

app.use('/api/v1/users', authRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError(req.originalUrl)
})

app.use(errorHandler)
