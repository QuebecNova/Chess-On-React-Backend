import { Request } from "express";
import jwt from "jsonwebtoken";

export const signAndAttachJWT = (req: Request, id: string, email: string) => {
  const userJwt = jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    ...req.session,
    jwt: userJwt,
  };
};
