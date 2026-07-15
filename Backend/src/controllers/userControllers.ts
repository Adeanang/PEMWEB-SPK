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
        nama:true,
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