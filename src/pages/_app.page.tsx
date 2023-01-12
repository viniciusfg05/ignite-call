import type { AppProps } from "next/app";
import { GlobalStyles } from "../../styles/global";
import { SessionProvider } from "next-auth/react";

GlobalStyles();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
