import { Request, Response } from "express";

export const getCurrentUser = async (req: Request, res: Response) => {
    res.send({ user: req.user });
};
