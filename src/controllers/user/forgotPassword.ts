import { Request, Response } from 'express'
import { User } from '../../models/user'
import { NotFoundError } from '../../errors/NotFound'
import { InternalError } from '../../errors/Internal'
import { Email } from '../../helpers/email'

export const forgotPassword = async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        throw new NotFoundError(
            'There is no user with email: ' + req.body.email
        )
    }

    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    try {
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`

        await new Email(user, resetURL).sendResetPassword()

        res.json({
            status: 'success',
            message: 'Your password reset token send to your email',
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        throw new InternalError(
            'There was an error sending email. Please try again later'
        )
    }
}
