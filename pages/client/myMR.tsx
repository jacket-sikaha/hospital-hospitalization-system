import Head from "next/head";
import { ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "../_app";
import React, { useState } from "react";
import ClientLayout from "@/components/clientLayout";
import {
  ActionSheet,
  Button,
  Collapse,
  Dialog,
  Divider,
  List,
  Popup,
  Space,
  Tag,
  Toast,
} from "antd-mobile";
import axios from "axios";
import { mrType, patientType } from "../dataType";
const ClientMR: NextPageWithLayout = (props) => {
  const [mrs, setMrs] = useState<mrType[]>([]);
  const getMrList = async () => {
    const arr = JSON.parse(localStorage.getItem("HHS_CLIENT_ID") || "[]");
    if (!arr.length) {
      Toast.show("no data");
      return;
    }
    const tmp = await axios.post(`/api/patient/find`, {
      queryData: {
        id: {
          $in: arr,
        },
      },
    });
    const res = await axios.post(`/api/mr/find`, {
      queryData: {
        pid: {
          $in: tmp.data.result.map(({ _id }: patientType) => _id),
        },
        readyAdmission: 0,
      },
    });
    setMrs(res.data.result);
  };
  useEffect(() => {
    getMrList();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Collapse accordion>
          {mrs.map((mr) => (
            <Collapse.Panel
              key={mr._id}
              title={
                <div>
                  <h4>{mr.name}</h4>
                  <Space style={{ fontSize: ".5rem" }}>
                    <Tag color="#108ee9">住院日期范围</Tag>
                    {mr.admission_date + "---" + mr.dischargeDate}
                  </Space>
                </div>
              }
            >
              <Space direction="vertical" style={{ fontSize: ".3rem" }}>
                <Space>
                  <Tag color="#f50">诊断</Tag>
                  {mr.diagnostic || "---"}
                </Space>
                <Space>
                  <Tag color="#cd201f">主治医师</Tag>
                  {mr.doctor || "---"}
                </Space>
                <Space>
                  <Tag color="#87d068">缴费详情</Tag>
                  {mr.money?.total || "---"}
                </Space>
              </Space>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </>
  );
};

ClientMR.getLayout = function getLayout(page: ReactElement) {
  // page属性就是当前页面组件component的内容
  // 有需要的话可以在此基础上多嵌套几个layout组件
  return (
    <>
      <ClientLayout>{page}</ClientLayout>
    </>
  );
};

export default ClientMR;
