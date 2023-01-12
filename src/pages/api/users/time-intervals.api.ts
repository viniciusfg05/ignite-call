import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { setCookie } from "nookies";
import { unstable_getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { z } from "zod";

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekday: z.number(),
      startTimeInMinute: z.number(),
      endTimeInMinute: z.number(),
    })
  ),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
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

  // parse: retorna os dados timados
  const {} = timeIntervalsBodySchema.parse(req.body);

  return res.json({ session });
}
