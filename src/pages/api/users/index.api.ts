import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { setCookie } from "nookies";
import { Session } from "inspector";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, username } = req.body;

  // Verifica se no models existe um username igual da requizição
  const useExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (useExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  setCookie({ res }, "@igitecall:userId", user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/", // Define que todas as rotas vao ter acesso ao cookie
  });

  return res.status(201).json(user);
}
