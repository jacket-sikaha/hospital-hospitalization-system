import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicComponent = dynamic(() => import("@/components/form"));

export default function PatientInformationInputPage() {
  return (
    <>
      <Head>
        <title>病人信息录入</title>
      </Head>
      <h2>病人信息录入</h2>
      <DynamicComponent></DynamicComponent>
    </>
  );
}
