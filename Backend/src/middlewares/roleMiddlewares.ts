import { Request, Response, NextFunction } from "express";

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      message: "Belum login",
    });
  }

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "Akses hanya untuk admin",
    });
  }

  next();
};
