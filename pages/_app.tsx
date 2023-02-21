import "@/styles/globals.css";
import Layout from "../components/layout/layout";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  console.log(234234);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
