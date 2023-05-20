import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Space,
  Switch,
  Transfer,
  message,
  Modal,
} from "antd";
import type { TransferDirection } from "antd/es/transfer";
import axios from "axios";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { faker } from "@faker-js/faker";
import { useRouter } from "next/router";
import { patientType } from "@/pages/dataType";
const { confirm } = Modal;
const { Meta } = Card;
export default function AdmissionJudgement() {
  const router = useRouter();
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);

  const [queryData, setQueryData] = useState({ readyAdmission: 1 });
  const { data, isFetching, error } = useQuery({
    queryKey: ["getPatient", queryData],
    queryFn: () =>
      axios.post(`/api/patient/find`, {
        queryData,
      }),
    keepPreviousData: true,
    onSuccess(data) {
      data.data.result.forEach((element: patientType) => {
        element.patientColor = faker.internet.color();
      });
    },
  });
  const queryClient = useQueryClient();
  const admissionMutation = useMutation({
    mutationFn: (data: { selKey: string[]; update: any }) =>
      axios.put("/api/patient/putMany", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["getPatient", queryData]);
      setTargetKeys([]);
      message.success("批准成功");
    },
  });

  const handleChange = (
    newTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => {
    setTargetKeys(newTargetKeys);

    console.log("targetKeys: ", newTargetKeys);
    console.log("direction: ", direction);
    console.log("moveKeys: ", moveKeys);
  };

  const handleSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    console.log("sourceSelectedKeys: ", sourceSelectedKeys);
    console.log("targetSelectedKeys: ", targetSelectedKeys);
  };

  const showPromiseConfirm = () => {
    confirm({
      title: "入院批准确认",
      // icon: <ExclamationCircleFilled />,
      content: "入院批准确认，此操作将不可逆！",
      onOk() {
        return admissionMutation.mutate({
          selKey: targetKeys,
          update: { readyAdmission: 2 },
        });
      },
      onCancel() {},
    });
  };

  const renderItem = (item: any) => {
    const customLabel = (
      <Card
        style={{
          height: 50,
          display: "flex",
          alignItems: "center",
        }}
        size="small"
        bordered={false}
        loading={isFetching}
      >
        <Meta
          style={{
            display: "flex",
            fontSize: ".5rem",
            alignItems: "center",
          }}
          avatar={
            <Avatar
              style={{
                backgroundColor: item.patientColor || "blue",
                verticalAlign: "middle",
              }}
            >
              {item.name[0]}
            </Avatar>
          }
          title={item.name}
          description={`${item.phone} | ${parseInt(item.gender) ? "男" : "女"}`}
        />
      </Card>
    );

    return {
      label: customLabel, // for displayed item
      value: item.name, // for title and filter matching
    };
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>线下审核符合入院标准请移入右方</h3>
        <Transfer
          rowKey={(record) => record._id}
          style={{ margin: "2rem" }}
          dataSource={data?.data.result}
          titles={["申请列表", "入院批准"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={renderItem}
          disabled={disabled}
          listStyle={{
            width: 300,
            height: 550,
            margin: "1rem",
          }}
          oneWay
          showSearch
          pagination
        />
        <Space>
          <Button type="primary" onClick={showPromiseConfirm}>
            批准确认
          </Button>
        </Space>
      </div>
    </>
  );
}
