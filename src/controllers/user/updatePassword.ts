import { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../../models/user'
import { BadRequestError } from '../../errors/BadRequest'
import { signAndAttachJWT } from '../../helpers/jwt'

export const validationUpdatePassword = [
    body('password').trim().notEmpty().withMessage('Password must be provided'),
    body('newPassword')
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage('New password must be between 8 and 20 characters'),
    body('newPasswordConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('The passwords do not match'),
]

export const updatePassword = async (req: Request, res: Response) => {
    const { password, newPassword, newPasswordConfirm } = req.body

    const user = await User.findOne({ email: req.user!.email })

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new BadRequestError('Incorrect password')
    }

    user.password = newPassword
    user.passwordConfirm = newPasswordConfirm
    user.save()

    signAndAttachJWT(req, user.id, user.email)
}
