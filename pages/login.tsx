import Head from "next/head";
import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
const AuthForm = dynamic(import("@/components/auth/auth-form"), { ssr: false }); // Async API cannot be server-side rendered

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthForm />
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default Login;
