import { NextFunction, Request, Response } from 'express'
import { NotAuthorizedError } from '../errors/NotAuthorized'

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        throw new NotAuthorizedError()
    }
    next()
}
