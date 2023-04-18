import Head from "next/head";
import { ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "../_app";
import React, { useState } from "react";
import ClientLayout from "@/components/clientLayout";
import {
  ActionSheet,
  Button,
  Dialog,
  Divider,
  List,
  Popup,
  Space,
  Toast,
} from "antd-mobile";
import { AddCircleOutline } from "antd-mobile-icons";
import { useRouter } from "next/router";
import axios from "axios";
import { Action } from "antd-mobile/es/components/action-sheet";
import { GetServerSideProps } from "next";
const ClientMR: NextPageWithLayout = (props) => {
  const [users, setUsers] = useState<patientType[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectItem, setSelectItem] = useState<string>();
  const actions: Action[] = [
    // { text: "复制", key: "copy" },
    {
      text: "撤回",
      key: "delete",
      danger: true,
      bold: true,
      onClick: async () => {
        const result = await Dialog.confirm({ content: "确定要撤回吗？" });
        const target = users.find((obj) => obj.id === selectItem);
        if (target) {
          target.admission_date = "";
          target.readyAdmission = false;
          await axios.put("/api/patient/put", target);
          if (result) {
            await getUserList();
            Toast.show("执行了撤回操作");
          }
        }
      },
    },
  ];
  const getUserList = async () => {
    const arr = JSON.parse(localStorage.getItem("HHS_CLIENT_ID") || "[]");
    if (!arr.length) {
      Toast.show("error");
      return;
    }
    const res = await axios.post(`/api/patient/find`, {
      queryData: {
        id: {
          $in: arr,
        },
      },
    });
    setUsers(res.data.result.filter((obj: patientType) => obj.readyAdmission));
  };
  useEffect(() => {
    getUserList();
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
              onClick={() => {
                setVisible(true);
                setSelectItem(user.id);
              }}
              description={user.phone}
              extra={
                <Button color="primary" fill="outline">
                  操作
                </Button>
              }
            >
              {user.name}
            </List.Item>
          ))}
        </List>
        <ActionSheet
          extra={selectItem}
          visible={visible}
          closeOnAction
          // extra="请选择你要进行的操作"
          cancelText="取消"
          actions={actions}
          onClose={() => {
            setVisible(false);
            setSelectItem("");
            console.log(12312313);
          }}
        />
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
