import { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../../models/user'
import { signAndAttachJWT } from '../../helpers/jwt'
import { BadRequestError } from '../../errors/BadRequest'

export const validationSignUp = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters'),
    body('passwordConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('The passwords do not match'),
]

export const signUp = async (req: Request, res: Response) => {
    const { email, password, passwordConfirm } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new BadRequestError('Email in use')
    }

    const user = await User.build({ email, password, passwordConfirm })

    signAndAttachJWT(req, user.id, user.email)

    res.status(201).send(user)
}
