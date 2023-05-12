import { useRouter } from "next/router";
import axios from "axios";
import {
  ActionType,
  EditableFormInstance,
  EditableProTable,
  ProColumns,
  ProDescriptions,
  ProForm,
  ProFormText,
} from "@ant-design/pro-components";
import dayjs from "dayjs";
import {
  AutoComplete,
  Form,
  Input,
  List,
  Space,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  message,
} from "antd";
import { drugType, mrType } from "@/pages/dataType";
import MyTag from "./TPSEdit";
import { useRef } from "react";

export default function MRManagePage({ mrid }: any) {
  const ref = useRef<ActionType>();
  const columns: any = [
    {
      title: "id",
      dataIndex: "_id",
      editable: false,
    },
    {
      title: "姓名",
      dataIndex: "name",
      editable: false,
    },
    {
      title: "手机",
      dataIndex: "phone",
      editable: false,
    },
    {
      title: "性别",
      dataIndex: "gender",
      editable: false,
      render: (text: any) => {
        return parseInt(text) ? "男" : "女";
      },
    },
    {
      title: "紧急联系人",
      editable: false,
      dataIndex: "emergency_contact_name",
    },
    {
      title: "紧急联系人电话",
      editable: false,
      dataIndex: "emergency_contact_phone",
    },
    {
      title: "地址",
      editable: false,
      dataIndex: "address",
      span: 3,
    },
    {
      title: "所属科室",
      editable: false,
      dataIndex: "department_name",
    },
    {
      title: "床位名",
      editable: false,
      dataIndex: "bed_name",
      span: 2, //一行最多3个
    },
    {
      title: "主诉",
      dataIndex: "problem",
      editable: (_: any, obj: mrType) => {
        return obj.doctor ? true : false;
      },
    },
    {
      title: "诊断",
      dataIndex: "diagnostic",
      editable: (_: any, obj: mrType) => {
        return obj.doctor ? true : false;
      },
    },
    {
      title: "病历状态",
      editable: false,
      dataIndex: "readyAdmission",
      render: (text: any) => {
        return text === 3 ? "处理中" : "已完成";
      },
    },
    {
      title: "医疗化验检查安排",
      dataIndex: "examination",
      span: 1,
      editable: (_: any, obj: mrType) => {
        return obj.doctor ? true : false;
      },
      renderFormItem: (item: any, param: any, form: any) => <MyTag />,
      render: (val: any) => {
        return (
          <Timeline>
            {val?.map(({ value, res }: any, index: number) => {
              return (
                <Timeline.Item
                  key={value + index}
                  color={res ? "green" : "blue"}
                >
                  <Tooltip
                    title={res || "等待结果中"}
                    color={res ? "green" : "blue"}
                  >
                    {value}
                  </Tooltip>
                </Timeline.Item>
              );
            })}
          </Timeline>
        );
      },
    },
    {
      title: "治疗计划",
      dataIndex: "TPS",
      span: 2,
      editable: (_: any, obj: mrType) => {
        return obj.doctor ? true : false;
      },
      render: (val: any) => {
        return (
          <List
            dataSource={val}
            renderItem={(item: any, index) => (
              <List.Item>
                {index + 1}。{item.value}
                <Typography.Text mark>[NOTICE]</Typography.Text>
              </List.Item>
            )}
          />
        );
      },
      renderFormItem: (item: any, param: any, form: any) => <MyTag />,
    },
    {
      title: "用药安排",
      dataIndex: "Medication",
      editable: false,
      span: 3,
      render: (val: any) => {
        return (
          <List
            dataSource={val}
            size="small"
            renderItem={(item: drugType, index) => (
              <List.Item
                extra={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <div style={{ margin: ".5rem" }}>
                      <div style={{ color: "#00000073" }}>药剂师</div>
                      <div style={{ color: "#000000D9" }}>
                        {item.pharmacist || "-"}
                      </div>
                    </div>
                    <div style={{ margin: ".5rem" }}>
                      <div style={{ color: "#00000073" }}>是否分配</div>
                      <div style={{ color: "#000000D9" }}>
                        {item.status ? "是" : "否"}
                      </div>
                    </div>
                    <div style={{ margin: ".5rem" }}>
                      <div style={{ color: "#00000073" }}>价格</div>
                      <div style={{ color: "#000000D9" }}>{item.price}</div>
                    </div>
                  </div>
                }
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <Space size={[10, 8]} wrap>
                      用药剂量:<Tag color="#f50">{item.specification}</Tag>
                      用药频率:<Tag color="#2db7f5">{item.use_time}</Tag>
                      使用数量:<Tag color="#87d068">{item.use_count}</Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        );
      },
    },
    {
      title: "负责医生",
      dataIndex: "doctor",
      editable: (_: any, obj: mrType) => {
        return obj.doctor ? true : false;
      },
    },
    {
      title: "创建日期",
      dataIndex: "createDate",
      valueType: "date",
      editable: (_: any, obj: mrType) => {
        return obj.doctor ? true : false;
      },
      search: {
        transform: (value: any) => {
          return { createDate: dayjs(value).format("YYYY-MM-DD") };
        },
      },
    },
  ];

  const handleRequest = async (params: any) => {
    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
    // 如果需要转化参数可以在这里进行修改
    try {
      const res = await axios.get(`/api/mr/find/${mrid}`);
      return {
        data: res.data.result,
        // success 请返回 true，
        // 不然 table 会停止解析数据，即使有数据
        success: true,
        // 不传会使用 data 的长度，如果是分页一定要传
        // total: number,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
      };
    }
  };

  const handleUpdate = async (record: mrType) => {
    try {
      const res = await axios.put(`/api/mr/putByID`, record);
      message.success("修改成功");
      return {
        data: res.data.result,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        success: false,
      };
    }
  };
  return (
    <>
      <ProDescriptions
        title="病历详细信息"
        bordered
        request={handleRequest}
        columns={columns}
        editable={{
          onSave: (key: any, row: mrType): any => {
            let newObj = { ...row };
            if (key === "createDate") {
              newObj.createDate = dayjs(row.createDate).format("YYYY-MM-DD");
            }
            return handleUpdate(newObj);
          },
        }}
      ></ProDescriptions>
    </>
  );
}
