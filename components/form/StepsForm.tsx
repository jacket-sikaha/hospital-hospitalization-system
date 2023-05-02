import {
  EditableFormInstance,
  EditableProTable,
  ProColumns,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
} from "@ant-design/pro-components";
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from "@ant-design/pro-components";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input, Mentions, Select, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { drugType, mrType } from "@/pages/dataType";
import axios from "axios";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const StepsForms = () => {
  const formRef = useRef<ProFormInstance>();
  const editorFormRef = useRef<EditableFormInstance<drugType>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [prefix, setPrefix] = useState("");
  const [dataSource, setDataSource] = useState<drugType[]>([]);
  const selOpt = useRef(null);
  const [searchOpt, setSearchOpt] = useState<drugType[]>([]);

  const columns: ProColumns<drugType>[] = [
    {
      title: "药品名称",
      dataIndex: "name",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      renderFormItem: (obj: any) => (
        <AutoComplete
          onSearch={setPrefix}
          onSelect={(value, option) => {
            selOpt.current = option;
          }}
          options={searchOpt?.map(
            ({ _id, name, specification, price }): any => {
              return {
                key: _id,
                value: name,
                label: name,
                id: obj.entry.id,
                index: obj.index,
                status: false,
                name,
                specification,
                price,
              };
            }
          )}
        />
      ),
      width: "30%",
    },
    {
      title: "用药剂量",
      dataIndex: "specification",
    },
    {
      title: "用药频率",
      valueType: "digit",
      dataIndex: "use_time",
    },
    {
      title: "数量",
      valueType: "digit",
      dataIndex: "use_count",
    },
    {
      title: "操作",
      valueType: "option",
    },
  ];

  const handleOnFinish = async (val: any) => {
    try {
      let selKey = {
          name: val.name,
          bed_name: val.bed_name,
          readyAdmission: 3,
        },
        update = { ...val, name: undefined, bed_name: undefined };
      await axios.put("/api/mr/put", { selKey, update });
      message.success("提交成功");
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };
  useEffect(() => {
    const handleFetchOption = async () => {
      const res = await axios.post(`/api/drug/findAll`, {
        queryData: { name: prefix },
      });
      setSearchOpt(() => {
        return res.data.data;
      });
    };
    handleFetchOption();
  }, [prefix]);

  return (
    <ProCard>
      <StepsForm<{
        name: string;
      }>
        formRef={formRef}
        onFinish={async (val) => await handleOnFinish(val)}
        formProps={{
          validateMessages: {
            required: "此项为必填项",
          },
        }}
      >
        <StepsForm.StepForm<{
          name: string;
        }>
          name="patient"
          title="病人基本信息"
          stepProps={{
            description: "开始",
          }}
        >
          <ProFormText
            name="name"
            label="姓名"
            width="md"
            tooltip="用于标定的唯一 id"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="bed_name"
            label="床位名"
            width="md"
            tooltip="用于标定的唯一 id"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          name: string;
        }>
          name="诊断和主诉"
          title="诊断和主诉"
        >
          <ProFormText
            name="problem"
            label="主诉"
            width="md"
            tooltip="问询病人症状"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="diagnostic"
            label="诊断"
            width="md"
            placeholder="请输入"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          name: string;
        }>
          name="化验检查安排"
          title="化验检查安排"
        >
          <ProFormList
            name="examination"
            copyIconProps={false}
            deleteIconProps={{
              Icon: CloseCircleOutlined,
              tooltipText: "不需要这行了",
            }}
          >
            {(
              meta, // 当前行的基本信息 {name: number; key: number}
              index, // 当前的行号
              action,
              count // 总行数
            ) => {
              return (
                <ProFormText
                  name="value"
                  label="检查安排"
                  addonBefore={index + 1}
                />
              );
            }}
          </ProFormList>
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          name: string;
        }>
          name="治疗计划"
          title="治疗计划"
        >
          <ProFormList
            name="TPS"
            copyIconProps={false}
            deleteIconProps={{
              Icon: CloseCircleOutlined,
              tooltipText: "不需要这行了",
            }}
            initialValue={[
              {
                value: "",
              },
            ]}
          >
            {(
              _, // 当前行的基本信息 {name: number; key: number}
              index // 当前的行号
            ) => {
              return (
                <ProFormText
                  name="value"
                  label="治疗方案"
                  tooltip="请一项一项分行填写"
                  addonBefore={index + 1}
                  rules={[{ required: true }]}
                />
              );
            }}
          </ProFormList>
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          name: string;
        }>
          name="用药安排"
          title="用药安排"
          onFinish={async (val) => {
            console.log("val", val);
            await waitTime(1000);
            return true;
          }}
        >
          <ProForm.Item
            label="用药列表"
            name="Medication"
            trigger="onValuesChange"
          >
            <EditableProTable<drugType>
              rowKey="id"
              toolBarRender={false}
              editableFormRef={editorFormRef}
              value={dataSource}
              // 添加行数，修改值都会触发
              onChange={(val: any) => {
                console.log("val", val);
                const option: any = selOpt.current;
                if (!option) {
                  setDataSource(val);
                  return;
                }
                setDataSource(() => {
                  val[option.index] = {
                    ...option,
                    key: undefined,
                    value: undefined,
                    label: undefined,
                    index: undefined,
                  };
                  return val;
                });
                selOpt.current = null;
              }}
              controlled
              columns={columns}
              recordCreatorProps={{
                newRecordType: "dataSource",
                // 配置新增行的默认数据
                record: (index, b): drugType => {
                  return { id: Date.now().toString(), status: false };
                },
              }}
              editable={{
                type: "multiple",
                onChange: setEditableRowKeys,
                editableKeys,
                actionRender: (row, _, dom) => {
                  // console.log("row", row, _);
                  return [dom.delete];
                },
                // 编辑状态下先执行onValuesChange 再到onchange
                // onValuesChange: (record: any, recordList) => {
                //   console.log(" recordList", record);
                // },
              }}
            />
          </ProForm.Item>
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="确认"
          title="确认"
          stepProps={{
            description: "结束",
          }}
        >
          <ProFormText
            name="doctor"
            label="医生签名"
            width="md"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormDatePicker
            name="createDate"
            label="创建日期"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};
export default StepsForms;
