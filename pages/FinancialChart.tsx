import Head from "next/head";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MoneyChart = dynamic(() => import("@/components/chart/MoneyChart"), {
  ssr: false,
});

export default function FinancialChartPage() {
  return (
    <>
      <Head>
        <title>财务报表</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoneyChart></MoneyChart>
    </>
  );
}
