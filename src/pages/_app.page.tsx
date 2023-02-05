import "../lib/dayjs";
import type { AppProps } from "next/app";
import { GlobalStyles } from "../../styles/global";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import { DefaultSeo } from "next-seo";

GlobalStyles();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: "website",
            locale: "pt_BR",
            url: "https://call-agenda.ignite.call.com",
            siteName: "Call agenda",
          }}
        />

        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
