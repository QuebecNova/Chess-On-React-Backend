import express from 'express'
import { signOut } from '../controllers/auth/signout'
import { signIn, validationSignIn } from '../controllers/auth/signin'
import { signUp, validationSignUp } from '../controllers/auth/signup'
import { requireAuth } from '../middlewares/requireAuth'
import { validateRequest } from '../middlewares/validateRequest'

export const authRouter = express.Router()

authRouter.get('/signout', requireAuth, signOut)

authRouter.post('/signin', validationSignIn, validateRequest, signIn)

authRouter.post('/signup', validationSignUp, validateRequest, signUp)
