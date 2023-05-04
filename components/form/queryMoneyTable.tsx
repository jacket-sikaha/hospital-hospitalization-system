import { ProColumns, ProFormDatePicker } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import axios from "axios";
import { useRouter } from "next/router";
import dayjs from "dayjs";

const QueryMoneyTable = () => {
  const router = useRouter();
  const columns: ProColumns[] = [
    {
      title: "账单编号",
      dataIndex: "_id",
      search: false,
    },
    {
      title: "病人姓名",
      dataIndex: "name",
    },
    {
      title: "用药费用",
      dataIndex: "medication",
      search: false,
    },
    {
      title: "住院费用",
      dataIndex: "hospitalization",
      search: false,
    },
    {
      title: "医疗检查费用",
      dataIndex: "examination",
      search: false,
    },
    {
      title: "治疗费用",
      dataIndex: "cure",
      search: false,
    },
    {
      title: "总共消费",
      dataIndex: "total",
      search: false,
    },
    {
      title: "付款日期",
      dataIndex: "date",
      valueType: "date",
      search: {
        transform: (value: any) => {
          return { date: dayjs(value).format("YYYY-MM-DD") };
        },
      },
    },
  ];

  const handleRequest = async (queryData: any, sort: any, filter: any) => {
    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
    try {
      const newObj = { ...queryData };
      // 遍历对象属性
      for (const key in newObj) {
        if (newObj.hasOwnProperty(key) && newObj[key] === "") {
          // 将空字符串的属性值置为undefined
          newObj[key] = undefined;
        }
      }
      const res = await axios.post(`/api/financial/find`, {
        queryData: newObj,
      });
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
    <ProTable
      columns={columns}
      request={handleRequest}
      rowKey="_id"
      pagination={false}
      scroll={{ y: 520 }}
    />
  );
};
export default QueryMoneyTable;
