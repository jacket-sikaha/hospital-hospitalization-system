import React, { useState } from "react";
import { Button, Form } from "antd";
import { Space, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const MyTag: React.FC<{
  value?: {
    key?: string;
    label: string;
  }[];
  onChange?: (
    value: {
      key?: string;
      label: string;
    }[]
  ) => void;
}> = ({ value, onChange }) => {
  const [TPS, setTPS] = useState<
    {
      key?: string;
      label: string;
    }[]
  >(value || []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setTPS((old: any) => {
      const newTp = old[index]; // 获取当前元素
      newTp.value = e.target.value; // 更新当前元素的 value 属性
      const newTps = [...old]; // 复制整个 TPS 数组
      newTps[index] = newTp; // 更新对应位置的元素
      onChange?.(newTps);
      return newTps; // 返回新的 TPS 数组
    });
  };
  function removeChange(index: number): void {
    setTPS((old: any) => {
      const newTps = [...old]; // 复制整个 TPS 数组
      newTps.splice(index, 1);
      onChange?.(newTps);
      return newTps; // 返回新的 TPS 数组
    });
    // onChange?.([...TPS]); //  在这里修改TPS还不是最新的，也就是拿不到最新值
  }
  function add(): void {
    setTPS((old: any) => {
      const newTps = [...old]; // 复制整个 TPS 数组
      newTps.push({
        value: "",
      });
      onChange?.(newTps);
      return newTps; // 返回新的 TPS 数组
    });
  }

  console.log("newTps", value);

  return (
    <>
      <Form name="dynamic_form_item">
        {TPS?.map((val: any, index: number) => {
          return (
            <Form.Item
              key={index}
              label={index + 1}
              name={index}
              // rules={[
              //   {
              //     required: true,
              //     message: "Please input!",
              //   },
              // ]}
            >
              <Space>
                <Input
                  onChange={(e) => handleInputChange(e, index)}
                  value={val.value}
                />
                {!val.res && (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => removeChange(index)}
                  />
                )}
              </Space>
            </Form.Item>
          );
        })}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            style={{ width: "60%", margin: "0 auto" }}
            icon={<PlusOutlined />}
          >
            Add field
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default MyTag;
