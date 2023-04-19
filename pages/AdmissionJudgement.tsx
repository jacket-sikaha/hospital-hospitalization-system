import Head from "next/head";
import dynamic from "next/dynamic";
const DynamicComponent = dynamic(
  () => import("@/components/admissionJudgement")
);

import React, { useEffect, useState } from "react";

export default function AdmissionJudgementPage() {
  return (
    <>
      <Head>
        <title>入院审核</title>
      </Head>
      <h2>入院审核</h2>
      <DynamicComponent></DynamicComponent>
    </>
  );
}
