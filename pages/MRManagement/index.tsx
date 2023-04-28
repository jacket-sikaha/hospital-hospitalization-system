import Head from "next/head";
import dynamic from "next/dynamic";
const QueryTable = dynamic(() => import("@/components/form/queryTable"), {
  ssr: false,
}); // Async API cannot be server-side rendered

export default function MRManagePage() {
  return (
    <>
      <Head>
        <title>病历管理</title>
      </Head>
      <QueryTable></QueryTable>
    </>
  );
}
