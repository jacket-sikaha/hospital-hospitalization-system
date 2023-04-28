import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const MRDetail = dynamic(() => import("@/components/mrDetail/index"), {
  ssr: false,
}); // Async API cannot be server-side rendered

export default function MRManagePage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>病历详细信息</title>
      </Head>
      <MRDetail mrid={router.query.mrid}></MRDetail>
    </>
  );
}
