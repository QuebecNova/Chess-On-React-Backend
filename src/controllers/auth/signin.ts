import { Request, Response } from 'express'
import { body } from 'express-validator'
import { User } from '../../models/user'
import { Password } from '../../helpers/password'
import { signAndAttachJWT } from '../../helpers/jwt'
import { BadRequestError } from '../../errors/BadRequest'

export const validationSignIn = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be provided'),
]

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        throw new BadRequestError('Invalid credentials')
    }

    const passwordMatch = user.correctPassword(user.password, password)

    if (!passwordMatch) {
        throw new BadRequestError('Invalid credentials')
    }

    signAndAttachJWT(req, user.id, user.email)

    res.send(user)
}
