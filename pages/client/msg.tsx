import { ReactElement, RefObject, useEffect } from "react";
import type { NextPageWithLayout } from "../_app";
import React, { useState } from "react";
import ClientLayout from "@/components/clientLayout";
import {
  Button,
  DatePicker,
  DatePickerRef,
  Form,
  Input,
  Radio,
  Space,
  TextArea,
  Image,
  List,
  Divider,
} from "antd-mobile";
import { AddCircleOutline } from "antd-mobile-icons";
import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const ClientMSG: NextPageWithLayout = (props) => {
  const [users, setUsers] = useState<patientType[]>([]);
  const router = useRouter();
  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem("HHS_CLIENT_ID") || "[]");
    if (!arr.length) {
      return;
    }
    const first = async () => {
      const res = await axios.post(`/api/patient/find`, {
        queryData: {
          id: {
            $in: arr,
          },
        },
      });
      setUsers(res.data.result);
      console.log("res", res);
    };
    first();
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
        <List header="用户列表" style={{ flex: 1 }}>
          {users.map((user) => (
            <List.Item
              key={user.id}
              description={
                <Space>
                  {user.phone} <Divider direction="vertical" />
                  {user.gender ? "男" : "女" || "无"}{" "}
                  <Divider direction="vertical" />
                  {user.id}
                  <Divider direction="vertical" />
                </Space>
              }
            >
              {user.name}
            </List.Item>
          ))}
        </List>
        <Button
          color="primary"
          fill="outline"
          size="large"
          style={{ width: "60%", margin: "2rem auto", flex: 0 }}
          onClick={() => {
            router.replace("/client/patientAdd");
          }}
        >
          <AddCircleOutline /> 添加
        </Button>
      </div>
    </>
  );
};

ClientMSG.getLayout = function getLayout(page: ReactElement) {
  // page属性就是home组件的内容
  // 有需要的话可以在此基础上多嵌套几个layout组件
  return (
    <>
      <ClientLayout>{page}</ClientLayout>
    </>
  );
};

export default ClientMSG;
