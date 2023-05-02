import { ProColumns, ProFormDatePicker } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import axios from "axios";
import { useRouter } from "next/router";
import type { mrType } from "../../pages/dataType";
import { Typography } from "antd";
import dayjs from "dayjs";

const QueryTable = () => {
  const router = useRouter();
  const columns: ProColumns[] = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "手机",
      dataIndex: "phone",
      search: false,
    },
    {
      title: "所属科室",
      dataIndex: "department_name",
    },

    {
      title: "诊断",
      dataIndex: "diagnostic",
      search: false,
    },
    {
      title: "负责医生",
      dataIndex: "doctor",
    },
    {
      title: "创建日期",
      dataIndex: "createDate",
      // renderFormItem: (item, param, form) => {
      //   console.log(item, param);
      //   return <ProFormDatePicker name={item.key} />;
      // },
      valueType: "date",
      search: {
        transform: (value: any) => {
          return { createDate: dayjs(value).format("YYYY-MM-DD") };
        },
      },
    },
    {
      title: "病历状态",
      dataIndex: "readyAdmission",
      search: false,
      filters: [
        {
          text: "处理中",
          value: 3,
        },
      ],
      onFilter: (value: any, record: mrType) => {
        return record.readyAdmission === 3;
      },
      render: (text: any) => {
        return text === 3 ? "处理中" : "已完成";
      },
    },
    {
      title: "详细信息",
      dataIndex: "detail",
      search: false,
      render: (_: any, record: mrType) => {
        return (
          <Typography.Link
            onClick={() => router.push(`/MRManagement/${record._id}`)}
          >
            detail
          </Typography.Link>
        );
      },
    },
  ];

  const handleRequest = async (queryData: any, sort: any, filter: any) => {
    // console.log(queryData, sort, filter);
    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
    // 如果需要转化参数可以在这里进行修改
    try {
      const newObj = { ...queryData };
      // 遍历对象属性
      for (const key in newObj) {
        if (newObj.hasOwnProperty(key) && newObj[key] === "") {
          // 将空字符串的属性值置为undefined
          newObj[key] = undefined;
        }
      }
      const res = await axios.post(`/api/mr/find`, { queryData: newObj });
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

  return (
    <ProTable
      columns={columns}
      request={handleRequest}
      rowKey="_id"
      pagination={false}
      scroll={{ y: 480 }}
    />
  );
};
export default QueryTable;
