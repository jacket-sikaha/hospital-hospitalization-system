import Head from "next/head";
import dynamic from "next/dynamic";

// const Dashboard = dynamic(import("@/components/dashboard/index"), {
//   ssr: false,
// }); // Async API cannot be server-side rendered
import { Card, Col, Row } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const tabList = ["内科", "外科", "妇产科", "小儿科", "神经科", "消化内科"].map(
  (str, i) => ({
    key: i.toString(),
    tab: str,
  })
);
const App = () => (
  <Row gutter={16}>
    <Col span={6}>
      <Card title="Card title">Card content</Card>
    </Col>
    <Col span={6}>
      <Card title="Card title">Card content</Card>
    </Col>
    <Col span={6}>
      <Card title="Card title">Card content</Card>
    </Col>
    <Col span={6}>
      <Card title="Card title">Card content</Card>
    </Col>
  </Row>
);
const contentList: Record<string, React.ReactNode> = {
  0: App(),
  1: <p>content2</p>,
};
export default function BedAllocationPage() {
  const [activeTabKey1, setActiveTabKey1] = useState<string>("0");

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };
  // const initialData = (filter: { readyAdmission: number }) => {
  //   return Promise.all([
  //     axios.post(`/api/patient/find`, {
  //       queryData: filter,
  //     }),
  //     axios.post(`/api/bed/find`),
  //   ]);
  // };
  // readyAdmission为其他的说明该住院记录已完成
  const [queryData, setQueryData] = useState({ readyAdmission: 3 });
  const { data, isFetching, error } = useQuery({
    queryKey: ["getPatient", queryData],
    queryFn: () => axios.post(`/api/mr/find`),
    keepPreviousData: true,
    onSuccess(data) {
      // data.data.result.forEach((element: patientType) => {
      //   element.patientColor = faker.internet.color();
      // });
    },
  });
  return (
    <>
      <Head>
        <title>患者管理监控</title>
      </Head>
      <Card
        style={{ width: "100%", height: "100%" }}
        title="患者管理监控"
        extra={<a href="#">More</a>}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
    </>
  );
}
