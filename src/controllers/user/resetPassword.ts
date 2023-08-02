import { Request, Response } from 'express'
import { User } from '../../models/user'
import { encrypt } from '../../helpers/encrypt'
import { BadRequestError } from '../../errors/BadRequest'
import { signAndAttachJWT } from '../../helpers/jwt'
import { body } from 'express-validator'

export const validationResetPassword = [
    body('password')
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters'),
    body('passwordConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('The passwords do not match'),
]

export const resetPassword = async (req: Request, res: Response) => {
    const { password, passwordConfirm } = req.body

    const hashedToken = encrypt(req.params.token)

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
        throw new BadRequestError('Invalid or expired token')
    }

    user.password = password
    user.passwordConfirm = passwordConfirm
    user.passwordResetExpires = undefined
    user.passwordResetToken = undefined

    await user.save()

    signAndAttachJWT(req, user.id, user.email)
}
