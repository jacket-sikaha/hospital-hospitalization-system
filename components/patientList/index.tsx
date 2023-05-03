import { ProList } from "@ant-design/pro-components";
import { Button, Cascader, Divider, Space, Tag, message } from "antd";
import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { bedOptionsType, bedType, patientType } from "@/pages/dataType";

const dropdownRender = (menus: React.ReactNode) => (
  <div>
    {menus}
    <Divider style={{ margin: 0 }} />
    <div style={{ padding: 8 }}>科室 / 床位号</div>
  </div>
);

export default function BedAllocationPage() {
  const [dataSource, setDataSource] = useState<patientType[]>([]);
  const [queryData, setQueryData] = useState({ readyAdmission: 2 });
  const [bedOptions, setBedOptions] = useState<bedOptionsType[]>([]);
  const [selOptions, setSelOptions] = useState<number[][]>();
  const originOptData: any = useRef();
  const originData: any = useRef();

  const initialData = (filter: { readyAdmission: number }) => {
    return Promise.all([
      axios.post(`/api/patient/find`, {
        queryData: filter,
      }),
      axios.post(`/api/bed/find`),
    ]);
  };
  const queryClient = useQueryClient();
  const { data, isFetching, error } = useQuery({
    queryKey: ["getPatient", queryData],
    queryFn: () => initialData(queryData),
    keepPreviousData: true,
    onSuccess([promiseA, promiseB]) {
      const tmp = parseOptions(promiseB.data.result);
      originData.current = [...promiseB.data.result];
      originOptData.current = [...tmp];
      setBedOptions(tmp);
      setDataSource(promiseA.data.result);
      setSelOptions(new Array(promiseA.data.result.length));
    },
  });

  const parseOptions = (arr: bedType[]) => {
    let tmp: bedOptionsType[] = new Array(6);
    arr.forEach(
      ({
        _id,
        id,
        department_id,
        department_name,
        patient_id,
        bed_name,
      }: bedType) => {
        if (!tmp[department_id]) {
          tmp[department_id] = {
            value: department_id,
            label: department_name,
            children: tmp[department_id]?.children || [],
          };
        }

        if (!patient_id) {
          tmp[department_id].children?.push({
            value: _id,
            label: bed_name,
            id: id,
          });
        }
      }
    );
    return tmp;
  };

  const handleCasChange = (value: any | undefined, index: number) => {
    setSelOptions((old: any) => {
      old[index] = [...value, index];
      return old;
    });
    setBedOptions((old: any) => {
      let tmp = JSON.parse(JSON.stringify(originOptData.current));
      selOptions?.forEach(([a, b]) => {
        tmp[a].children[
          old[a].children.findIndex((obj: bedOptionsType) => obj.value === b)
        ].disabled = true;
      });
      return tmp;
    });
  };

  const onSummit = async () => {
    let param: any = {
      bed: { selKey: [], update: [] },
      patient: { selKey: [], update: { readyAdmission: 3 } },
      mr: [],
    };
    // console.log("selOptions", selOptions);
    selOptions?.forEach(([did, bid, pIndex]) => {
      let pid = dataSource[pIndex]._id;
      param.bed.selKey.push(bid);
      param.bed.update.push({ patient_id: pid });
      param.patient.selKey.push(pid);
      param.mr.push({
        ...dataSource[pIndex],
        ...originData.current.find((obj: any) => obj._id === bid),
        pid,
        bid,
        readyAdmission: 3,
        id: undefined,
        _id: undefined,
        patient_id: undefined,
      });
    });
    try {
      await axios.put(`/api/bed/bookbed`, param);
      queryClient.invalidateQueries(["getPatient", queryData]);
      message.success("success");
    } catch (error: any) {
      message.error(error.message);
    }
  };
  return (
    <>
      <ProList<patientType>
        rowKey="id"
        headerTitle="床位分配"
        tooltip="请分配好床位后点击右侧按钮一并提交"
        dataSource={dataSource}
        showActions="hover"
        bordered={true}
        toolBarRender={() => {
          return [
            <Button key="add" type="primary" onClick={onSummit}>
              分配提交
            </Button>,
          ];
        }}
        metas={{
          title: {
            dataIndex: "name",
            editable: false,
          },
          subTitle: {
            render: (_, row) => {
              return (
                <Space size={0}>
                  <Tag color="blue">{row.gender == "1" ? "男" : "女"}</Tag>
                  <Tag color="#5BD8A6">{row.phone}</Tag>
                </Space>
              );
            },
          },
          actions: {
            render: (text, row, index, action) => {
              return (
                <Cascader
                  options={bedOptions}
                  dropdownRender={dropdownRender}
                  placeholder="Please select"
                  expandTrigger="hover"
                  allowClear={false}
                  onChange={(value, selectedOptions) =>
                    handleCasChange(value, index)
                  }
                />
              );
            },
          },
        }}
      />
    </>
  );
}
