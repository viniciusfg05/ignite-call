import dayjs from "dayjs";
import { google } from "googleapis";
import { prisma } from "./prisma";

export async function getGoogleAuthToken(userId: string) {
  // procurando o user id que o provider seja o google
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: "google",
      user_id: userId,
    },
  });

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at
      ? Math.floor(account.expires_at / 1000)
      : null, // salvar em segundos,
  });

  if (!account.expires_at) {
    return auth;
  }

  // quando o dayjs vai ler, ele precisa do "expires_at" em ms
  const isTokenExpered = dayjs(account.expires_at * 1000).isBefore(new Date()); // converte pra ms

  if (!isTokenExpered) {
    const {
      credentials: {
        access_token,
        expiry_date,
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    } = await auth.refreshAccessToken();

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null, // salvar em segundos
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    });

    //
    auth.setCredentials({
      access_token,
      refresh_token,
      expiry_date,
    });
  }

  return auth;
}
