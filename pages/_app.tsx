import "@/styles/globals.css";
import Layout from "../components/layout/layout";
import type { AppProps } from "next/app";
import { getSession, SessionProvider } from "next-auth/react";

import { ReactElement, ReactNode, useEffect } from "react";
import type { NextPage } from "next";
import { QueryClient, QueryClientProvider } from "react-query";

import "dayjs/locale/zh-cn";
import locale from "antd/locale/zh_CN";
// import locale from "antd/lib/locale/zh_CN";
import { ConfigProvider } from "antd";

import localFont from "@next/font/local";

// Font files can be colocated inside of `pages`
// const myFont = localFont({
//   src: "../public/三极行楷简体-粗.ttf",
// });
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// 创建一个 client
const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  // 检测页面组件page里是否含有getLayout属性，没有就采用设计好的layout组件包裹显示
  // 被Layout组件包裹的页面会受到session的时效性检验
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <SessionProvider session={session}>
      <ConfigProvider locale={locale}>
        <QueryClientProvider client={queryClient}>
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </ConfigProvider>
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
