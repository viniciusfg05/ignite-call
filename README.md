# Observações
* ESLINT
    - Comandos no de Script ao passarmos um parametro seguido do script ```npm run lint```
    - Para da ```--fix``` precisamos add ```--``` entre a expreção: ```npm run lint -- --fix```
* STITCHES
    - Para estilizar um Elemento que ventem do stitches ou do designer system, ao invés
    de passarmos a tag. Podemos passar dessa forma
    ~~~js
    import { Heading} from "@ignite-ui/react";
    
        [`${Heading}`]: {
        color: 'red'
        }
    ~~~
* Redirecionamento usuando o useRouter ``router.push('/register')`` para Redirecionar para outra URL, é importe add o `await`,
para que espere o processo de submit, caso contrário o JS entenderia que o processo já foi executado e já jogaria para URL. Desta forma, podemos ultilizar o `isSubmitting` do react hookform para desabilitar o botão no processo de


# Configurações iniciais

- Configurando o glogal.css
- Ultilizando o stitches
- Ultilizando o SSG do stitches para carregamento do css sem o JS
    Dentro do header, temos que configurar um style com essas Configurações
        ```<style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />```
- Configurando ESLINT
    * Intalando o ESLINT da Rocketseat
        ```npm i @rocketseat/eslint-config -D```
    * Configurando o ESLINT, devemos criar uma arquivo ```.eslintrc.json```
        ~~~json
            {
              "extends": [
                "next/core-web-vitals",
                "@rocketseat/eslint-config/react"
              ]
            }            
        ~~~
- Page Extensions - Configuração do ```next.config.js``` 
    - para definirmos quais arquivos
    seram um rota, desta forma somente os os arquivos que definirmos como parametro seram
    uma rota.
    - A propriedade de config é ```pageExtensions``` que recebe um array de strings
        ```pageExtensions: ['page.tsx', 'api.ts', 'api.tsx']```
    , desta forma somente os os arquivos que 
        ```nome.page.tsx, nome.api.tsx, nome.api.ts```
    seram definidos como uma rota.

# Trabalhando com React-Hook-forma

  ## Configuração Inicial do React-Hook-forma

  - Vamos chamar a função ```useForm```, desestruturando o `register`, `handleSubmit`
  - Dentro do input vamos add a propriedade `register`, uma função que recebe uma string com o nome do input
       ```{...register('username')}```
  - Detro do form o vamos add o onSubmit e add a função `handleSubmit` de dentro do useForm, recebendo uma função
      ```onSubmit={handleSubmit(handleFunção)}```

  ## Lidando com validações com React Hook form



  # Trabalhando como React hookform no `src\pages\register\time-intervals\index.page.tsx`
    - Metodo para interar sobre uma defaltValue que é uma array
      ~~~ts
        // pode interar uma array no formulario como o map
        const { fields } = useFieldArray({
          control, // para o useform saber que ele vai lidar com o campo acima "intervals"
          name: "intervals", // nome do campo no formulario
        });
      ~~~
    - Passando o register para o input onde temos uma defaltValue em formato de array
      ~~~tsx
        <TextInput
          size="sm"
          type="time"
          step={60}
          {...register(`intervals.${index}.startTime`)}
          // intervals: nome do campo do array
          // index: index da posiçao do array pega de dentro do retorno de {fields.map((field, index) => (...
          // startTime: nome do array
        ></TextInput>
      ~~~
    - Passando o register para elemento que não são nativos do html
      - <Controller /> vindo react-hook-form, é um component que serve para gente controlar elemente
      que não são nativos do html que recebe como paramentro:
        - name - capo de interação igual o exemplo acima do register
        - control - que igual o `useFieldArray` recebe o control
        - render - uma função que server para renderizar o elemento, função element que tem como
        paramentro desestruturado o field que tem propriedade para lidarmos com o estado do elemento

        ~~~tsx
          <Controller
            name={`intervals.${index}.enabled`}
            control={control}
            render={({ field }) => {
              return (
                <Checkbox
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true);
                  }}
                  checked={field.value}
                />
              );
            }}
          />
        ~~~

# Zod

  ## Validando os dados:
  - Ultilizaremos o ```zod```
  - Vamos criar uma const que receber ```z``` uma importação do `zod`, que tem como propriedade um `object`
  - Passamos o type para ```useForm<ClaimUsernameForm>```
      ~~~TS
          const ClaimUsernameSchema = z.object({
              username: z.string(),
          } 
          type ClaimUsernameForm = z.infer<typeof ClaimUsernameSchema>          
      ~~~
  
  - Para validarmos o input, vamos ultilização o ```@hookform/resolvers```
  - Vamos importa o `zodResolver` de ```import { zodResolver } from '@hookform/resolvers/zod'```
  - useForm recebe um object de configuração que recebe ``resolver``
  - E passamos o ```zodResolver(ClaimUsernameSchema)```, que recebe como propriedade o schem  
  - Zod nos permite fazer fazer validações de quais caracteres permitidos, com a propriedade ```.regex```
      ```.regex(/^([a-z\\-]+)$/i, { message: "user minimo 3 caracteres, apenas letras e hífens" })```
  - Transformar os caracteres maiúsculos em minúsculos, com a propriedade ```.transform```
      ```.transform((username) => username.toLocaleLowerCase()),``  
  - Para apresentar o erro na tela, vamos pegar a propriedade ```formState: { errors }``` do `useForm`
  - Joga no html ``{ errors.username?.message }``

  ## Server para validação de dados
  - Array com varios objetos - z.ojetect: indica que vada posição do array é um objeto
    ~~~ts
      intervals: z
          .array(
            z.object({
              weekDay: z.number().min(0).max(6),
              enabled: z.boolean(),
              startTime: z.string(),
              endTime: z.string(),
            })
          )
          .length(7) // indica que sempre vamos receber 7 dias da semana
          .transform((intervals) =>
            intervals.filter((intervals) => intervals.enabled === true)
          )
          .refine((intervals) => intervals.length > 0, {
            message: "Você precisa seleciona pelo menos um dia da semana",
          }),
          .transform((intervals) => {
            // vamos sobrescrever o intervals para converter as horas em minutos, pois ficará muito facil de trabalhar
            return intervals.map((intervals) => {
              return {
                weekDay: intervals.weekDay,
                startTimeInMinute: convertTimeStringToMinutes(intervals.startTime),
                endTimeInMinute: convertTimeStringToMinutes(intervals.endTime),
              };
            })
            .refine(
              (intervals) => {
                // every: se todos cumprem com a condição, diferente do some: que retorna se encontrar qualquer um
                return intervals.every(
                  (interval) =>
                    interval.endTimeInMinute - 60 === interval.startTimeInMinute
                );
              },
              {
                message:
                  "O horario de termino precisa ter um diferença de 1 hora do horario de inicio",
              }
            ),
          }),
      });
    ~~~

  - Transformação de dados : Ex acima
    - `transform()` tranform recebe o array original a ser tranformado
      - filtrando desta forma será retornado apenas o intervals ativos

    - `refine()` trabalha da msm forma que tranform, mas ele retorna um true: valido, false: invalido

    - `transform()` para retorna as hora em minutos
      - Precisamos criar uma função que recebe a string horas "08:00"
      - `split()` retorna no numero antes de ":" e depois
        ~~~ts
          export function convertTimeStringToMinutes(timeString: string) {
            // dive onde tem ":" usando o split
            const [hours, minutes] = timeString.split(":").map((item) => Number(item));

            return hours * 60 + minutes;
          }
        ~~~
      
    - `refine()` vamos verificar se o horario de termino tem uma diferenção de um hora do horario de inicio

    ## retorno dos dados do zod
      - Após fazer todas as tranformações o "zod" indentifica os valores finais de toda a tranformação,
      mas isso é uma problema, pois no inicio que estamos apenas recebendo os dados, não temos acesso ao dados originais,
      como por exemplo passar a timpagem para o `useForm<TimeIntervalsFormData>()` ele irá retona os dados finais.
      
      Para resolver esse problema o zod ao inferismos o schema de valição, inves de usarmos o `z.infer`
        `type TimeIntervalsFormData = z.infer<typeof timeIntervalFormsSchema>`
      ultilizaremos o `z.input` e `z.output`, desta forma vamos passar um schema de entrada e saída
        ~~~ts
          type TimeIntervalsFormInput = z.input<typeof timeIntervalFormsSchema>;
          type TimeIntervalsFormOutput = z.output<typeof timeIntervalFormsSchema>;
        ~~~

# Pegar uma query na rota é repassar para a pagina

    - Usaremos de dentro do useForm o `setValue`: com ele podemos definir qual input desejamos setar o value
~~~ts
    const router = useRouter()
    
    useEffect(() => {
      if(router.query.username) {
          setValue('username',  router.query.username)
      }
    }, [router.query?.username, setValue])
~~~


# Prisma
  - Instalar a CLI do Prismo `npm i prisma -D`
  - Instalar a dependecia `npm i @prisma/client`
  - Iniciar o prisma - ```npx prisma init``` - recebe um parametro --datasource-provider
  - ``--datasource-provider`` - banco de dados que estamos Ultilizando
  - Será criado uma pasta "prisma" e ".env"

  # Criando um banco de dados com linguagem do Prisma
  ~~~prisma
      model Use {
        id       String @id @default(uuid())
        username String @unique // Campo unico
        name     String
        created_at DateTime @default(now())
        @@map("users") // Define o nome da tabela 
      }
  ~~~

  # Para criar o banco de dados
      - ``npx prisma migrate dev`` - irá verificar oq mudou e executar
      - ``npx prisma studio`` - Cria um servidor para vermos o banco de dados

  # Inicializar o prisma - basta criar um arquivo ``lib/prisma.ts``
  ~~~ts
      import { PrismaClient } from "@prisma/client    
      export const prisma = new PrismaClient({
        log: ["query"], // mostra no console os logging
      });
  ~~~

  # Existe o metodo findUnique, que vai procurar em todos as instacias do models que são unicos 
      ~~~ts
        const { name, username } = req.body;
        // Verifica se no models existe um username igual da requizição
        const useExists = await prisma.use.findUnique({
          where: {
            username,
          },
        });
      ~~~

# Axios

    # Para pegar o erro retornado pelo response usando o Axios
        - Precisamos definir que o erro é instanciado pelo AxiosError, desta forma o JS 
            entende que dentro de erro existe o metodos `response?.data.message`
    
    ~~~ts
        if (error instanceof AxiosError && error.response?.data.message) {
                alert(error.response?.data.message);
        }
    ~~~

# Cookies
    
  # Api Padrão 
  - Enviar cookies - ```res.setHeader('Set-Cookie', [])```
  - Receber cookies - ```req.cookies```
  
  # npm i nookies - Pacotes feito para trabalhar com cookies no react
    - A inteligencia do tS não irá funcionar com o nookies, pois ele usar uma outra biblioteca
        chamada ``cookie``, para funcionar precisamos instalar as tipagem dela.
            ``npm i @types/cookie -D``
      
  # Como salvar os cookie - 
    - Useremos a função setCookie, que recebe como paramentro um  object, que irá receber o `res`
        pq detro de existe a propriedade setHeader que possibilita criar o cookie
    - Segundo paramentro, recebe uma string com o nome do cookie
    - Terceiro é a propriedade a ser salva no cookie, no exemplo é o user.id
    - vamos passar `maxAge` tempo de expiração e `path` define qual rota vai ter acesso ao cooki  
    ~~~ts
        import { setCookie } from "nookies";    
        setCookie({ res }, "@igitecall:userId", user.id, {
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: "/", // Define que todas as rotas vao ter acesso ao cookie
        });
    ~~~

# Autenticação Auth

  - Criando um arquivo dentro de ```api/auth/[...nextauth].ts```
    ~~~ts
        import NextAuth, { NextAuthOptions } from "next-auth";
        import GoogleProvider from "next-auth/providers/google";
        export const authOptions: NextAuthOptions = {
          providers: [
            GoogleProvider({
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            }),
          ],
        };
        export default NextAuth(authOptions);
    ~~~

  - Erro: {
      Type 'string | undefined' is not assignable to type 'string'.
      Type 'undefined' is not assignable to type 'string'.ts(2322)
      oauth.d.ts(91, 5): The expected type comes from property 'clientId' which is declared here on type 'OAuthUserConfig<any>'
  }, podemos resolver colocando uma conticional com string vazia

  - Precisamos criar um token para assinar o jwt no processo de logging
      Esse codigo pode ser qualquer coisa com o nome `NEXTAUTH_SECRET`


  ## Escopos no NEXTAUTH -  DOCS: https://developers.google.com/identity/protocols/oauth2/scopes
    Para definirmos o scopo no GOOGLE, precisamos enviar uma url que informa na propria documentação
    ~~~ts
          authorization: {
          params: {
            scope:
              "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar",
          },
        },
    ~~~
  ## CallBacks no NEXTAUTH
    - Podemos verificar se o scopo foi aceito, se não retornamos algo. Usando a função `signIn`
    que precisamos retorno um true ou false, 
    ~~~ts
      callbacks: {
          async signIn({ account }) {
            if (
              !account?.scope?.includes("https://www.googleapis.com/auth/calendar")
            ) {
              return "/register/connect-calender/?error-permissions=false";
            }
            return true; // false: não deixa o usuario autenticar || true: Sucesso
          },
        },
    ~~~
    - Podemos pegar esse erro no front ccom o useRouter
    ~~~ts
        const router = useRouter();
        const hasAuthError = !router.query.error;
    ~~~

# ADAPTERS - Salvando as Informações de Autenticação - DOCS https://next-auth.js.org/adapters/prisma
  * ADAPTERS é como os repositories no backend, ele serve como intermedio entre o banco de dados e o auth

  - Vamos Criar o schema.prisma - os models da tabela
   
      ~~~prisma
            // This is your Prisma schema file,
            // learn more about it in the docs: https://pris.ly/d/prisma-schema

            generator client {
              provider = "prisma-client-js"
            }

            datasource db {
              provider = "sqlite"
              url      = env("DATABASE_URL")
            }

            model User {
              id         String   @id @default(uuid())
              username   String   @unique // Campo unico
              name       String
              email      String?  @unique
              avatar_url String?
              created_at DateTime @default(now())

              accounts Account[]
              sessions Session[]

              @@map("users") // Define o nome da tabela 
            }

            model Account {
              id                  String  @id @default(cuid())
              user_id             String
              type                String
              provider            String
              provider_account_id String
              refresh_token       String?
              access_token        String?
              expires_at          Int?
              token_type          String?
              scope               String?
              id_token            String?
              session_state       String?

              user User @relation(fields: [user_id], references: [id], onDelete: Cascade)

              @@unique([provider, provider_account_id])
              @@map("accounts") // Define o nome da tabela 
            }

            model Session {
              id            String   @id @default(cuid())
              session_token String   @unique
              user_id       String
              expires       DateTime
              user          User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

              @@map("sessions") // Define o nome da tabela 
            }

      ~~~

  - Criando os adapters - lib/nextauth/prisma-adapter.ts

    ~~~ts
        import { Adapter } from "next-auth/adapters";
        import { prisma } from "../prisma";
        export function PrismaAdapter(): Adapter {
          return {
                async createUser(user) {
                    // buscar o id do usuario nos cookie
                    const { "@igitecall:userId": userIdOnCoockies } = parseCookies({ req });
              
                    if (!userIdOnCoockies) {
                      throw new Error("User Id not found on Coockies");
                    }
              
                    const prismaUser = await prisma.user.update({
                      where: {
                        id: userIdOnCoockies,
                      },
                      data: {
                        name: user.name,
                        email: user.email,
                        avatar_url: user.avatar_url,
                      },
                    });
              
                    destroyCookie({ res }, "@igitecall:userId", {
                      path: "/",
                    });
              
                    return {
                      id: prismaUser.id,
                      name: prismaUser.name,
                      username: prismaUser.username,
                      email: prismaUser.email!,
                      avatar_url: prismaUser.avatar_url!,
                      emailVerified: null,
                    };
                  },
              
                  async getUser(id) {
                    const user = await prisma.user.findUnique({
                      where: {
                        id,
                      },
                    });
              
                    if (!user) {
                      // para o next identification que o no exist
                      return null;
                    }
                    // user.email!: caso esteja dando erro no typescript colocando um "!", dizemos a ele que mesmo que o metodo esteja dando undefined e não pode receber undefiner, com o ponto de "!", dizemos a ele que esse metodo vai sim ser passado, que não é undefined nem nulo.
              
                    return {
                      id: user.id,
                      name: user.name,
                      username: user.username,
                      email: user.email!,
                      avatar_url: user.avatar_url!,
                      emailVerified: null,
                    };
                  },
                  async getUserByEmail(email) {
                    const user = await prisma.user.findUnique({
                      where: {
                        email,
                      },
                    });
              
                    if (!user) {
                      return null;
                    }
                    // user.email!: caso esteja dando erro no typescript colocando um "!", dizemos a ele que mesmo que o metodo esteja dando undefined e não pode receber undefiner, com o ponto de "!", dizemos a ele que esse metodo vai sim ser passado, que não é undefined nem nulo.
              
                    return {
                      id: user.id,
                      name: user.name,
                      username: user.username,
                      email: user.email!,
                      avatar_url: user.avatar_url!,
                      emailVerified: null,
                    };
                  },
                  async getUserByAccount({ providerAccountId, provider }) {
                    // a soma de providerAccountId + providerAccountId - forma uma capo unico - só pode exister um providerAccountId para cada provider e para cada usuario
                    const account = await prisma.account.findUnique({
                      where: {
                        provider_provider_account_id: {
                          provider,
                          provider_account_id: providerAccountId,
                        },
                      },
                      include: {
                        user: true, // traz junto com account o user
                      },
                    });
              
                    if (!account) {
                      return null;
                    }
              
                    const { user } = account;
              
                    return {
                      id: user.id,
                      name: user.name,
                      username: user.username,
                      email: user.email!,
                      avatar_url: user.avatar_url!,
                      emailVerified: null,
                    };
                  },
                  async updateUser(user) {
                    const prismaUser = await prisma.user.update({
                      where: {
                        id: user.id!,
                      },
                      data: {
                        // dados a serem atualizados
                        name: user.name,
                        email: user.email,
                        avatar_url: user.avatar_url,
                      },
                    });
              
                    return {
                      id: prismaUser.id,
                      name: prismaUser.name,
                      username: prismaUser.username,
                      email: prismaUser.email!,
                      avatar_url: prismaUser.avatar_url!,
                      emailVerified: null,
                    };
                  },
                  async linkAccount(account) {
                    // loga com provider diferente
                    await prisma.account.create({
                      data: {
                        user_id: account.userId,
                        type: account.type,
                        provider: account.provider,
                        provider_account_id: account.providerAccountId,
                        refresh_token: account.refresh_token,
                        access_token: account.access_token,
                        expires_at: account.expires_at,
                        token_type: account.token_type,
                        scope: account.scope,
                        id_token: account.id_token,
                        session_state: account.session_state,
                      },
                    });
                  },
              
                  async createSession({ sessionToken, userId, expires }) {
                    await prisma.session.create({
                      data: {
                        user_id: userId,
                        expires,
                        session_token: sessionToken,
                      },
                    });
              
                    return {
                      userId,
                      sessionToken,
                      expires,
                    };
                  },
                  async getSessionAndUser(sessionToken) {
                    const PrismaSession = await prisma.session.findUnique({
                      where: {
                        session_token: sessionToken,
                      },
                      include: {
                        user: true,
                      },
                    });
              
                    if (!PrismaSession) {
                      return null;
                    }
              
                    const { user, ...session } = PrismaSession;
              
                    return {
                      session: {
                        userId: session.user_id,
                        expires: session.expires,
                        sessionToken: session.session_token,
                      },
                      user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email!,
                        avatar_url: user.avatar_url!,
                        emailVerified: null,
                      },
                    };
                  },
                  async updateSession({ sessionToken, expires, userId }) {
                    const prismaSession = await prisma.session.update({
                      where: {
                        session_token: sessionToken,
                      },
                      data: {
                        // dados a serem atualizados
                        expires,
                        user_id: userId,
                      },
                    });
              
                    return {
                      sessionToken: prismaSession.session_token,
                      userId: prismaSession.user_id,
                      expires: prismaSession.expires,
                    };
                  },
              
                  async deleteSession(sessionToken) {
                    await prisma.session.delete({
                      where: {
                        session_token: sessionToken,
                      },
                    });
                  },
          };
        }
    ~~~

  - Para o mentodo createUser - 
    - Precisamos buscar o id salvo no cookie
      - Para isso precisamos Inicializar o next auth em advanced inicialization

        ~~~ts
            export const authOptions: NextAuthOptions = {
              //...
            };
    
            export default async function auth(req: NextApiRequest, res: NextApiResponse) {
              return await NextAuth(req, res, authOptions);
            }
        ~~~
        
    - vamos trandormar a const  authOptions em uma função, que irá ter como paramentro o req e o res

      ~~~ts
          export function buildNextAuthOptions(
            req: NextApiRequest,
            res: NextApiResponse
          ): NextAuthOptions {
            return {
              adapter: PrismaAdapter(req, res),
              providers: [
              //...
          }
  
          export default async function auth(req: NextApiRequest, res: NextApiResponse) {
            return await NextAuth(req, res, buildNextAuthOptions(req, res));
          }

          //lib/nextauth/prisma-adapter.ts
          - Basta receber detro de PrismaAdapter o req e o res
      ~~~

  - Passando o adapter criado para o api/auth/[...nextauth].api.ts

    ~~~ts
      import { PrismaAdapter } from "../../../lib/nextauth/prisma-adapter";
  
      export const authOptions: NextAuthOptions = {
        adapter: PrismaAdapter(),
        providers: [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
              params: {}
        //...
    ~~~


# Sobrescrevendo tipagem de biblioteca
    - Fizemos algumas alterações no schema para criar as tabelas do adapter, mas o next não está reconhecendo as atualizações
    - criar uma arquivo dentro: src/@types/next-auth.d.ts


# Retornando os dados completo da session 
  - Atualmente a aplicação retorna de ``const session = useSession();´´ apenas "name", "username"
  - Conseguimos configurar no next para retorna mais dados pelo "callbacks"
    ~~~js
      async session({ session, user }) {
        return {
          ...session,
          user,
        };
      },
    ~~~


# Converter o dia da semana "0, 1, 2, 3, 4, 5, 6" em dias nominais
  
  ~~~ts
    export function getWeekDays(): any {
      const formatted = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

      return Array.from(Array(7).keys())
        .map((day) => formatted.format(new Date(Date.UTC(2021, 5, day))))
        .map((weekday) => {
          return weekday
            .substring(0, 1)
            .toLocaleUpperCase()
            .concat(weekday.substring(1));
            // Deixa a primeira letra maiuscula
        });
    }

    // html
    const weekDays = getWeekDays();

    <Text>{weekDays[field.weekDay]}</Text>

  ~~~

# Salvando os time-intervals no DB 
   - Para pegar a sessão do usuario pelo lado do servidor - `api\users\time-intervals.api.ts`
