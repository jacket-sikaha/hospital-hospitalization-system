import Head from "next/head";
import dynamic from "next/dynamic";
const StepsForm = dynamic(() => import("@/components/form/StepsForm"), {
  ssr: false,
}); // Async API cannot be server-side rendered

export default function BedAllocationPage() {
  return (
    <>
      <Head>
        <title>医嘱开具</title>
      </Head>
      <StepsForm></StepsForm>
    </>
  );
}
