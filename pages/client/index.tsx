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
  Toast,
} from "antd-mobile";
import dayjs from "dayjs";
import axios from "axios";
const ClientAdmission: NextPageWithLayout = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<patientType[]>([]);
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
    setUsers(res.data.result.filter((obj: patientType) => !obj.readyAdmission));
  };
  useEffect(() => {
    getUserList();
  }, []);
  const onSubmit = async () => {
    const { patient, admission_date } = form.getFieldValue();
    const target = users[patient];
    if (!target) {
      return;
    }
    (target.admission_date = dayjs(admission_date).format("YYYY-MM-DD")),
      (target.readyAdmission = true);
    await axios.put("/api/patient/put", target);
    Toast.show("success");
    await getUserList();
    form.resetFields();
  };
  return (
    <>
      <Form
        layout="horizontal"
        form={form}
        onFinish={onSubmit}
        mode="card"
        footer={
          <Button block type="submit" color="primary" size="large">
            提交
          </Button>
        }
      >
        <Form.Header>信息登记</Form.Header>
        <Form.Item
          name="patient"
          label="就诊人"
          rules={[{ required: true, message: "就诊人不能为空" }]}
        >
          <Radio.Group defaultValue="0">
            <Space direction="vertical">
              {users.map((obj, i) => (
                <Radio key={obj.id} value={i}>
                  {obj.name}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Header>补充信息</Form.Header>
        <Form.Item
          name="admission_date"
          label="入院日期"
          trigger="onConfirm"
          rules={[{ required: true, message: "入院日期不能为空" }]}
          onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
            datePickerRef.current?.open();
          }}
        >
          <DatePicker>
            {(value) =>
              value ? dayjs(value).format("YYYY-MM-DD") : "请选择日期"
            }
          </DatePicker>
        </Form.Item>
      </Form>
    </>
  );
};

ClientAdmission.getLayout = function getLayout(page: ReactElement) {
  // page属性就是home组件的内容
  // 有需要的话可以在此基础上多嵌套几个layout组件
  return (
    <>
      <ClientLayout>{page}</ClientLayout>
    </>
  );
};

export default ClientAdmission;
