import Head from "next/head";
import dynamic from "next/dynamic";
const PatientList = dynamic(() => import("@/components/patientList/index"), {
  ssr: false,
}); // Async API cannot be server-side rendered

export default function BedAllocationPage() {
  return (
    <>
      <Head>
        <title>病床分配</title>
      </Head>
      <PatientList></PatientList>
    </>
  );
}
