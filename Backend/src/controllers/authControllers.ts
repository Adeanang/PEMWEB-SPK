import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { generateToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

   const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
});

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login berhasil",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return res.status(400).json({
        message: "Email sudah digunakan",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "Register berhasil",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
