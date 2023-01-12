import { Button, TextInput, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormAnnotation } from './styles'
import { useRouter } from 'next/router'

const ClaimUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Usuário precisa conter minímo 3 caracteres, letras e hiféns',
    })
    .transform((username): string => username.toLocaleLowerCase()), // expresão regular para conter apenas letras e "-" e que coomece e termine com essas regras
})

type ClaimUsernameForm = z.infer<typeof ClaimUsernameSchema>

export function ClaimUsernameForn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameForm>({
    resolver: zodResolver(ClaimUsernameSchema),
  })

  const router = useRouter()

  async function handleClaimUsename(data: ClaimUsernameForm) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsename)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuário"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado'}
        </Text>
      </FormAnnotation>
    </>
  )
}
