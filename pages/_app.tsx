import "@/styles/globals.css";
import Layout from "../components/layout/layout";
import type { AppProps } from "next/app";
import { getSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

import { ReactElement, ReactNode, useEffect } from "react";
import type { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);
  console.log(" ", getLayout);

  return (
    <SessionProvider session={session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
  // return (
  //   <SessionProvider session={session}>
  //     <Layout>
  //       <Component {...pageProps} />
  //     </Layout>{" "}
  //   </SessionProvider>
  // );
}
