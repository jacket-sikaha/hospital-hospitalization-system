import {
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
} from "@ant-design/pro-components";
import {
  ProForm,
  ProFormDatePicker,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useRef } from "react";

const FFF = () => {
  const formRef = useRef<ProFormInstance>();

  const getFormatValues = () => {
    console.log(
      "格式化后的所有数据：",
      formRef.current?.getFieldsFormatValue?.()
    );
  };

  const validateAndGetFormatValue = () => {
    formRef.current?.validateFieldsReturnFormatValue?.().then((values) => {
      console.log("校验表单并返回格式化后的所有数据：", values);
    });
  };

  return (
    <ProForm
      style={{ margin: 20 + "px" }}
      title="病人信息录入表单"
      formRef={formRef}
      submitter={{
        render: (props, doms) => {
          return [...doms];
        },
      }}
      onFinish={async (values: patientType) => {
        try {
          console.log(values);
          await axios.post(`/api/patient/ins`, values);
          message.success("提交成功");

          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormText
        width="md"
        name="name"
        label="姓名"
        placeholder="请输入姓名"
        rules={[{ required: true, message: "请输入!" }]}
        allowClear
      />
      <ProFormDigit
        width="md"
        name="age"
        label="年龄"
        min={1}
        placeholder="请输入年龄"
      />
      <ProFormRadio.Group
        name="gender"
        label="性别"
        placeholder="请输入性别"
        options={[
          {
            label: "男",
            value: "1",
          },
          {
            label: "女",
            value: "0",
          },
        ]}
      />

      <ProFormText
        width="md"
        name="phone"
        label="电话"
        placeholder="请输入电话"
        rules={[{ required: true, message: "请输入!" }]}
        allowClear
      />
      <ProFormText
        width="md"
        name="emergency_contact_name"
        label="紧急联系人"
        placeholder="请输入紧急联系人"
        allowClear
      />
      <ProFormText
        width="md"
        name="emergency_contact_phone"
        label="紧急联系人电话"
        placeholder="请输入紧急联系人电话"
        allowClear
      />
      <ProFormDatePicker
        label="日期"
        name="admission_date"
        initialValue={dayjs().format("YYYY-MM-DD")}
      />
    </ProForm>
  );
};

export default FFF;
