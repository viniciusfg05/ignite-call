// serve para sobrescrevermos as tipagem do adapter de dentro das tipagem do next js

import nextAuth from "next-auth"; // Precisa importa, pq se não o next vai entender que estamos criando uma tipagem do zer oe não sobrevevendo-a

declare module "next-auth" {
  interface User {
    // User: pq o AdapterUser extend o user
    id: string;
    name: string;
    email: string;
    username: string;
    avatar_url: string;
  }

  interface Session {
    user: User;
  }
}
