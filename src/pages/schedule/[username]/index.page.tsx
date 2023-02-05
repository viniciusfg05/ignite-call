import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { prisma } from "../../../lib/prisma";
import { ScheduleForm } from "./scheduleForm/index.page";
import { Container, UseHeader } from "./styles";

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatar: string;
  };
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name}  | Ignite Call`} noindex />

      <Container>
        <UseHeader>
          <Avatar src={user.avatar} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UseHeader>

        <ScheduleForm />
      </Container>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // para gerar apenas quando acessar a pagina
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 dia
  };
};
