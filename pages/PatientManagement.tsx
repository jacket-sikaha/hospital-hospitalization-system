import Head from "next/head";
import dynamic from "next/dynamic";
// const Dashboard = dynamic(import("@/components/dashboard/index"), {
//   ssr: false,
// }); // Async API cannot be server-side rendered
import {
  Avatar,
  Button,
  Card,
  Collapse,
  Form,
  Input,
  Modal,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Timeline,
  Tooltip,
  message,
} from "antd";
import React, { useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  OrderedListOutlined,
  IdcardOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { mrType } from "./dataType";
import { useRouter } from "next/router";
const { Meta } = Card;
const { Panel } = Collapse;
const dName = ["内科", "外科", "妇产科", "小儿科", "神经科", "消化内科"];
const tabList = dName.map((str, i) => ({
  key: i.toString(),
  tab: str,
}));

export default function BedAllocationPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [activeTabKey1, setActiveTabKey1] = useState<string>("0");
  const [contentList, setContentList] = useState<mrType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // readyAdmission为其他的说明该住院记录已完成
  const [queryData, setQueryData] = useState({
    readyAdmission: 3,
    department_id: parseInt(activeTabKey1),
  });
  const queryClient = useQueryClient();
  const { data, isFetching, error } = useQuery({
    queryKey: ["getPatient", queryData],
    queryFn: () => axios.post(`/api/mr/find`, { queryData }),
  });

  const showModal = (id: any) => {
    setIsModalOpen(true);
    setContentList(
      data?.data.result.find((obj: { _id: any }) => obj._id === id)
    );
  };
  const handleCancel = () => setIsModalOpen(false);
  const handleOk = async () => {
    if (
      !contentList ||
      !contentList.examination ||
      contentList.examination?.length === 0
    ) {
      setIsModalOpen(false);
      return null;
    }
    let tmp = Object.values(form.getFieldsValue());
    let record = { ...contentList };
    contentList.examination.forEach((obj: any, index: number) => {
      obj.res = tmp[index];
    });
    const res = await axios.put(`/api/mr/putByID`, record);
    message.success("登记成功");
    form.resetFields();
    setIsModalOpen(false);
    queryClient.invalidateQueries(["getPatient", queryData]);
  };

  const onTab1Change = (key: string) => {
    setActiveTabKey1(() => {
      setQueryData((old) => {
        let newObj = { ...old };
        newObj.department_id = parseInt(key);
        return newObj;
      });
      return key;
    });
  };

  const descriptionJSX = (object: mrType) => {
    return (
      <Collapse ghost expandIconPosition="end">
        <Panel
          key={object._id + 1}
          header={
            <Space size={[0, 8]} wrap>
              {/* <Tooltip title="prompt text"></Tooltip> */}
              <Tooltip title="床位名">
                <Tag icon={<IdcardOutlined />} color="#55acee">
                  {object.bed_name || "-"}
                </Tag>
              </Tooltip>
              <Tooltip title="入院日期">
                <Tag icon={<CalendarOutlined />} color="#3b5999">
                  {object.admission_date}
                </Tag>
              </Tooltip>
              <Tooltip title="诊断">
                <Tag icon={<EnvironmentOutlined />} color="#cd201f">
                  {object.diagnostic}
                </Tag>
              </Tooltip>
            </Space>
          }
        >
          <ol>
            {object.TPS?.map((item, index) => (
              <li key={item.value + index}>{item.value}</li>
            ))}
          </ol>
        </Panel>
      </Collapse>
    );
  };

  const modalJSX = () => {
    if (
      !contentList ||
      !contentList.examination ||
      contentList.examination?.length === 0
    ) {
      return null;
    }
    return (
      <Form
        form={form}
        name="control-hooks"
        style={{ width: 300, margin: "auto" }}
        preserve={false}
      >
        <Timeline>
          {contentList.examination?.map(
            ({ value, res }: any, index: number) => {
              return (
                <Space key={value + index}>
                  <Timeline.Item color={res ? "green" : "blue"}>
                    <Tooltip
                      title={res || "等待结果中"}
                      color={res ? "green" : "blue"}
                    >
                      {value}
                    </Tooltip>
                    <Form.Item name={index} label={"结果"} initialValue={res}>
                      <Input />
                    </Form.Item>
                  </Timeline.Item>
                </Space>
              );
            }
          )}
        </Timeline>

        <Form.Item>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    );
  };
  return (
    <>
      <Head>
        <title>患者管理监控</title>
      </Head>
      <Card
        style={{ width: "100%", height: "100%" }}
        title={<h2>患者管理监控</h2>}
        extra={
          <Statistic
            title={dName[parseInt(activeTabKey1)] + "在院人数"}
            value={data?.data?.result?.length}
          />
        }
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        <Space size={[18, 16]} wrap>
          {data?.data.result.map((obj: any) => {
            return (
              <Card
                key={obj._id}
                style={{ width: 300, height: "auto" }}
                hoverable
                actions={[
                  <Tooltip key={"plan"} title="医疗化验检查安排及登记">
                    <OrderedListOutlined onClick={() => showModal(obj._id)} />
                  </Tooltip>,
                  <Tooltip key="ellipsis" title="病人详细信息">
                    <EllipsisOutlined
                      onClick={() => router.push(`/MRManagement/${obj._id}`)}
                    />
                  </Tooltip>,
                ]}
              >
                <Skeleton loading={isFetching} avatar active>
                  <Meta
                    avatar={
                      obj.gender / 1 ? (
                        <Avatar size={"large"} src="/boy-1.png" />
                      ) : (
                        <Avatar size={"large"} src="/girl-7.png" />
                      )
                    }
                    title={<h3>{obj.name}</h3>}
                    description={descriptionJSX(obj)}
                  />
                </Skeleton>
                <Modal
                  title="医疗化验检查安排及登记"
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  destroyOnClose
                >
                  {modalJSX()}
                </Modal>
              </Card>
            );
          })}
        </Space>
      </Card>
    </>
  );
}
