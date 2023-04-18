import type { ReactElement, RefObject } from "react";
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
import axios from "axios";
import { useRouter } from "next/router";
const ClientMSGAdd: NextPageWithLayout = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const onSubmit = async (values: patientType) => {
    // const values = form.getFieldsValue();
    // console.log("values", values);
    try {
      const res = await axios.post(`/api/patient/find`, {
        queryData: {
          id: values.id,
        },
      });

      if (res.data.result.length !== 0) {
        Toast.show({
          icon: "error",
          content: "提交失败，用户已存在",
        });
        return;
      }
      await axios.post(`/api/patient/ins`, values);
      Toast.show({
        icon: "success",
        content: "提交成功",
      });

      const tmp = localStorage.getItem("HHS_CLIENT_ID");
      if (!tmp) {
        localStorage.setItem(
          "HHS_CLIENT_ID",
          JSON.stringify([values.id] || [])
        );
      } else {
        const arr = JSON.parse(tmp);
        arr.push(values.id);
        localStorage.setItem("HHS_CLIENT_ID", JSON.stringify(arr));
      }
      router.replace("/client/msg");
      return true;
    } catch (error) {
      Toast.show({
        icon: "fail",
        content: "fail",
      });
      return false;
    }
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
        <Form.Header>必填</Form.Header>
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: "姓名不能为空" }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ required: true, message: "手机号不能为空" }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          name="id"
          label="身份证号"
          rules={[{ required: true, message: "身份证号不能为空" }]}
        >
          <Input placeholder="请输入身份证号" />
        </Form.Item>
        <Form.Header>选填</Form.Header>
        <Form.Item label="性别" name="gender">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="1">男</Radio>
              <Radio value="0">女</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="address" label="地址" help="详情地址">
          <TextArea
            placeholder="请输入地址"
            maxLength={100}
            rows={2}
            showCount
          />
        </Form.Item>
      </Form>
    </>
  );
};

ClientMSGAdd.getLayout = function getLayout(page: ReactElement) {
  // page属性就是home组件的内容
  // 有需要的话可以在此基础上多嵌套几个layout组件
  return (
    <>
      <ClientLayout>{page}</ClientLayout>
    </>
  );
};

export default ClientMSGAdd;
