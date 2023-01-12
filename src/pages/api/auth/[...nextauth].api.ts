import { profile } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "../../../lib/nextauth/prisma-adapter";

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        authorization: {
          params: {
            scope:
              "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar",
          },
        },
        // retorna os dados do usuario do google
        profile(profile: GoogleProfile) {
          console.log(profile);
          return {
            id: profile.sub, // diminutivo para usuario
            name: profile.name,
            username: "",
            email: profile.email,
            avatar_url: profile.picture,
          };
        },
      }),
    ],

    callbacks: {
      async signIn({ account }) {
        if (
          !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
        ) {
          return "/register/connect-calender/?error-permissions=false";
        }

        return true; // false: não deixa o usuario autenticar || true: Sucesso
      },

      async session({ session, user }) {
        return {
          ...session,
          user,
        };
      },
    },
  };
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res));
}
