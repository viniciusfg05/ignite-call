import { Heading, Text } from "@ignite-ui/react";
import Image from "next/image";
import { Container, Here, Previews } from "./styles";
import previewImage from "../../assets/preview.png";
import { ClaimUsernameForn } from "./components/ClaimUsernameForn";
import { NextSeo } from "next-seo";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos
         no seu tempo livre."
      />

      <Container>
        <Here>
          <Heading as="h1" size="4xl">
            Agendamento descomplicado
          </Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForn />
        </Here>

        <Previews>
          <Image
            src={previewImage}
            width={400}
            alt="Calendário simbolizando aplicação em funcionamento"
            priority
            quality={100}
          />
        </Previews>
      </Container>
    </>
  );
}
