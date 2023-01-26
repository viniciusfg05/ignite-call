import type { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { prisma } from "../../../lib/prisma";
import { setCookie } from "nookies";
import { unstable_getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { z } from "zod";

const updateProfileBodySchema = z.object({
  bio: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  // obter informações do usuario logado `unstable_getServerSession() que funciona apena no lado do servidor`
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(401).end();
  }

  // parse: retorna os dados tipados
  const { bio } = updateProfileBodySchema.parse(req.body);

  // Criando uma session
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  });

  return res.status(204).end();
}
