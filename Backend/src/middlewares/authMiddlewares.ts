import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import jwt from "jsonwebtoken";


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    (req as any).user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token tidak valid",
    });
  }
};

export { verifyToken };
