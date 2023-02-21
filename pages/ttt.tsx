import Head from "next/head";
import dynamic from "next/dynamic";

const Dashboard = dynamic(import("@/pages/dashboard/index"), {
  ssr: false,
}); // Async API cannot be server-side rendered
export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>DashboardPage</title>
      </Head>
      <Dashboard />
    </>
  );
}
