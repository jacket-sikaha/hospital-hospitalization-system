import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  InputRef,
  message,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import type {
  ColumnType,
  FilterConfirmProps,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { resolve } from "path";

interface DataType {
  key?: string;
  _id: string;
  name: string;
  specification: string;
  price: number;
  manufacturer: string;
  inventory: number;
  incomingTime: string;
  outboundTime: string;
  type?: number;
  operation?: number;
}
// interface Item {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
// }

// const originData: Item[] = [];
// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
  children: React.ReactNode;
}

// 根据editing控制每一单元格的表单变化
const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function DrugManagement() {
  // 客户端组件内无法使用nodejs来调用数据库的方法
  // console.log("drugCount", drugCount());

  const [form] = Form.useForm();
  // const [data, setData] = useState(data);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getDrug", page, pageSize],
    // queryFn: () => getDrug(page),
    queryFn: () =>
      axios.get(`/api/drug/findAll?page=${page}&pageSize=${pageSize}`),
    keepPreviousData: true,
  });
  const mutation = useMutation({
    mutationFn: (obj: { operation: number; data: DataType }) => {
      if (obj.operation) {
        return axios.delete("/api/drug/delete", { _id: obj.data._id });
      }
      return axios.put("/api/drug/update", { record: obj.data });
    },
    onSuccess: (data, variables) => {
      console.log("data", variables);
      queryClient.setQueryData(["getDrug", { page, pageSize }], variables.data);
    },
  });

  const isEditing = (record: DataType) => record._id === editingKey;

  const edit = (record: Partial<DataType> & { _id: React.Key }) => {
    // setFieldsValue可以修改表单值，用以补上修改前的数据
    form.setFieldsValue(record);
    setEditingKey(record._id);
  };

  const cancel = (page: number, pageSize: number) => {
    if (!isNaN(page)) {
      setPageSize(pageSize);
      setPage(page);
    }

    setEditingKey("");
  };

  const delItem = (obj: DataType) => {
    mutation.mutate({ operation: 1, data: obj });
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;
      console.log("row", row, key);
      const newData: DataType = { _id: key, ...row };
      mutation.mutate({ operation: 0, data: newData });
      // const index = newData.findIndex((item) => key === item.key);
      // if (index > -1) {
      //   const item = newData[index];
      //   newData.splice(index, 1, {
      //     ...item,
      //     ...row,
      //   });
      //   setData(newData);
      //   setEditingKey("");
      // } else {
      //   newData.push(row);
      //   setData(newData);
      //   setEditingKey("");
      // }
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "药品名称",
      dataIndex: "name",
      width: "10%",
      editable: true,
    },
    {
      title: "规格",
      dataIndex: "specification",
      width: "10%",
      editable: true,
    },
    {
      title: "价格",
      dataIndex: "price",
      width: "10%",
      editable: true,
    },
    {
      title: "生产厂家",
      dataIndex: "manufacturer",
      width: "15%",
      editable: true,
    },
    {
      title: "库存量",
      dataIndex: "inventory",
      width: "10%",
      editable: true,
    },
    {
      title: "最近进货时间",
      dataIndex: "incomingTime",
      width: "15%",
      editable: true,
    },
    {
      title: "最近出库时间",
      dataIndex: "outboundTime",
      width: "15%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            {/* <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              color={"red"}
            >
              Delete
            </Typography.Link> */}
            <Popconfirm
              title="Delete the item"
              description="Are you sure to delete this item?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => delItem(record)}
            >
              <Typography.Link
                disabled={editingKey !== ""}
                style={editingKey === "" ? { color: "red" } : {}}
              >
                Delete
              </Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    // 初始化每一个单元格变化编辑表单所需要的属性值
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Head>
        <title>DrugManagement</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data?.data?.data}
          columns={mergedColumns}
          rowKey={(_) => _._id}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            current: page,
            pageSize: pageSize,
            total: data?.data.total,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ y: 600 }}
          loading={isLoading}
        />
      </Form>
    </>
  );
}
