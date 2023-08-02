import { Request, Response } from 'express'

export const signOut = async (req: Request, res: Response) => {
    req.session = null
    res.send({})
}
