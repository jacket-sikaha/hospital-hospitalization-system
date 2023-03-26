import Head from "next/head";
import React, { useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  InputRef,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import type {
  ColumnType,
  FilterConfirmProps,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
  const [formDrawer] = Form.useForm();
  const [formModal] = Form.useForm();
  const [openDrawer, setDrawerOpen] = useState(false);
  const [openModal, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingKey, setEditingKey] = useState("");
  const [queryData, setQueryData] = useState({});
  const queryClient = useQueryClient();
  const { data, isFetching, error } = useQuery({
    queryKey: ["getDrug", page, pageSize, queryData],
    // queryFn: () => getDrug(page),
    queryFn: () =>
      axios.post(`/api/drug/findAll?page=${page}&pageSize=${pageSize}`, {
        queryData,
      }),
    keepPreviousData: true,
  });
  const mutation = useMutation({
    mutationFn: (obj: { operation: number; data: DataType | string }) => {
      return obj.operation
        ? axios.delete("/api/drug/delete", { data: { id: obj.data } })
        : axios.put("/api/drug/update", { record: obj.data });
    },
    // variables 是mutation传入的参数
    onSuccess: (_, variables) => {
      console.log("variables", variables);
      // const { data, total } = _;
      // 使用setQueryData为什么会不执行更新
      // queryClient.setQueryData(["getDrug", { page, pageSize }], {
      //   total,
      //   ...data.value,
      // });
      queryClient.invalidateQueries(["getDrug", page, pageSize]);
    },
  });
  const addMutation = useMutation({
    mutationFn: (data: DataType) => axios.post("/api/drug/insert", { data }),
    onSuccess: () => {
      queryClient.invalidateQueries(["getDrug", page, pageSize]);
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
    return new Promise(async (resolve) => {
      //该方法是异步函数，属于消息队列
      // setTimeout(() => {  //谁先resolve（完成）,窗口就关闭
      //   console.log(1231);
      //   resolve(2);
      // }, 400);
      mutation.mutate({ operation: 1, data: obj._id });
    });
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
            <Popconfirm
              title="Delete the item"
              description="Are you sure to delete this item?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => delItem(record)}
              // okButtonProps={{ loading: mutation.isLoading }}
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

      <Space size={"large"} style={{ marginBottom: "1rem" }}>
        <Button
          type="primary"
          onClick={() => setDrawerOpen(true)}
          icon={<PlusOutlined />}
        >
          New drug
        </Button>
        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          icon={<SearchOutlined />}
        >
          查询数据
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setQueryData({});
            setPage(1);
            setPageSize(10);
          }}
        >
          重置筛选条件
        </Button>
      </Space>

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
          loading={isFetching}
        />
      </Form>

      <Drawer
        title="Create a new drug"
        width={420}
        onClose={() => {
          setDrawerOpen(false);
          formDrawer.resetFields();
        }}
        open={openDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form
          form={formDrawer}
          layout="vertical"
          style={{ maxWidth: 300 }}
          onFinish={(value: DataType) => {
            addMutation.mutate(value);
            setDrawerOpen(false);
            formDrawer.resetFields();
          }}
          hideRequiredMark
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Please enter name" allowClear />
          </Form.Item>
          <Form.Item
            name="specification"
            label="Specification"
            rules={[{ required: true, message: "Please enter specification" }]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Please enter specification"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            initialValue="1"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[{ required: true, message: "Please enter manufacturer" }]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Please enter manufacturer"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="inventory"
            label="Inventory"
            initialValue="1"
            rules={[{ required: true, message: "Please enter inventory" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="incomingTime"
            label="IncomingTime"
            rules={[
              { required: true, message: "Please choose the incomingTime" },
            ]}
          >
            <DatePicker format={"YYYY-MM-DD"} allowClear />
          </Form.Item>
          <Form.Item
            name="outboundTime"
            label="OutboundTime"
            rules={[
              {
                required: true,
                message: "please enter outboundTime",
              },
            ]}
          >
            <DatePicker format={"YYYY-MM-DD"} allowClear />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                htmlType="button"
                onClick={() => formDrawer.resetFields()}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        getContainer={false}
        title="查询数据"
        open={openModal}
        onOk={() => {
          const obj = formModal.getFieldsValue(true);
          let newObj: any = {};
          // console.log(Object.entries(obj));
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              let element = obj[key];
              newObj[key] =
                typeof element === "string"
                  ? element
                  : element.format("YYYY-MM-DD");
            }
          }
          setQueryData(newObj);
          setPage(1);
          setPageSize(10);
          setModalOpen(false);
        }}
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        <Form
          form={formModal}
          layout={"horizontal"}
          style={{ maxWidth: 300 }}
          hideRequiredMark
        >
          <Form.Item name="name" label="药品名称">
            <Input placeholder="Please enter name" allowClear />
          </Form.Item>

          <Form.Item name="manufacturer" label="生产厂商">
            <Input
              style={{ width: "100%" }}
              placeholder="Please enter manufacturer"
              allowClear
            />
          </Form.Item>

          <Form.Item name="incomingTime" label="最近进货时间">
            <DatePicker format={"YYYY-MM-DD"} allowClear />
          </Form.Item>
          <Form.Item name="outboundTime" label="最近出库时间">
            <DatePicker format={"YYYY-MM-DD"} allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
