import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight, Check } from "phosphor-react";
import { Container, Header } from "../styles";
import { AuthErro, ConectBox, ConectItem } from "./styles";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ConnectCalender() {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query["error-permissions"];
  const isSignIn = session.status === "authenticated";

  async function handleConnectCalendar() {
    await signIn("google");
  }

  async function handleNavidateToNextStep() {
    await router.push("/register/time-intervals");
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2}></MultiStep>
      </Header>

      <ConectBox>
        <ConectItem>
          <Text>Google Calendar</Text>
          {isSignIn ? (
            <Button size="sm" disabled>
              conectado <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConectItem>

        {hasAuthError && (
          <AuthErro size="sm">
            Falha ao se conectar com o Google, verifique se você hablitou as
            permissões de acesso ao Google Calendar
          </AuthErro>
        )}

        <Button
          onClick={handleNavidateToNextStep}
          type="submit"
          disabled={!isSignIn}
        >
          Proximo passo
          <ArrowRight />
        </Button>
      </ConectBox>
    </Container>
  );
}
