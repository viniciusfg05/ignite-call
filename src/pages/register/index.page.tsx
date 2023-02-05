import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../lib/axios";
import { Container, Form, FormError, Header } from "./styles";

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Minímo 3 caracteres" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "Usuário precisa conter minímo 3 caracteres, letras e hiféns",
    })
    .transform((username): string => username.toLocaleLowerCase()),
  name: z.string().min(3, { message: "Minímo 3 caracteres" }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerFormSchema) });

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post("/users", {
        name: data.name,
        username: data.username,
      });

      await router.push("/register/connect-calender");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        alert(error.response?.data.message);

        return;
      }
    }
  }

  const router = useRouter();

  useEffect(() => {
    if (router.query.username) {
      setValue("username", String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Calll</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1}></MultiStep>

          <Form as="form" onSubmit={handleSubmit(handleRegister)}>
            <label>
              <Text size="sm">Nome de usuário</Text>
              <TextInput
                prefix="ignite.com/"
                placeholder="seu-usuario"
                {...register("username")}
              />

              {errors.username && (
                <FormError size="sm">{errors.username.message}</FormError>
              )}
            </label>

            <label>
              <Text size="sm">Nome completo</Text>
              <TextInput placeholder="Nome completo" {...register("name")} />

              {errors.name && (
                <FormError size="sm">{errors.name.message}</FormError>
              )}
            </label>

            <Button type="submit">
              Proximo passo
              <ArrowRight />
            </Button>
          </Form>
        </Header>
      </Container>
    </>
  );
}
