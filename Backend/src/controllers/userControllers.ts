import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getProfile = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where:{
        id:userId
      },
      select:{
        id:true,
        email:true,
        role:true
      }
    });

    res.json(user);

  } catch(error){
    res.status(500).json({
      message:"Server error"
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { email, role }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};