import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (req.method === "GET") {
    if (!email || typeof email !== "string") {
      return}
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const { name, email } = req.body;
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        
        return res.status(200).json(existingUser);

      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
        },


      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } if (req.method === "PATCH") {
    const { name, email, location, phonenumber } = req.body;
  
    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { name, location, phonenumber},
      });
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

