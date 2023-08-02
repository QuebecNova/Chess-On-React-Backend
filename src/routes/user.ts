import express from 'express'
import { getCurrentUser } from '../controllers/user/currentUser'
import { requireAuth } from '../middlewares/requireAuth'
import { validateRequest } from '../middlewares/validateRequest'
import {
    resetPassword,
    validationResetPassword,
} from '../controllers/user/resetPassword'
import { forgotPassword } from '../controllers/user/forgotPassword'
import {
    updatePassword,
    validationUpdatePassword,
} from '../controllers/user/updatePassword'

export const userRouter = express.Router()

userRouter.get('/me', requireAuth, getCurrentUser)

userRouter.get(
    '/resetPassword/:token',
    validationResetPassword,
    validateRequest,
    resetPassword
)

userRouter.get('/forgotPassword', forgotPassword)

userRouter.get(
    '/updatePassword',
    requireAuth,
    validationUpdatePassword,
    validateRequest,
    updatePassword
)
