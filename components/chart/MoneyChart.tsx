import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef } from "react";
import { Line, LineOptions, Pie, PieOptions } from "@antv/g2plot";
import { Button, DatePicker, Form, Space } from "antd";
import { sumTotalByDate, sumTotalByType } from "../../lib/chart";
const { RangePicker } = DatePicker;
const lineOptions: LineOptions = {
  data: [],
  xField: "date",
  yField: "total",
  color: "#228B22",
  yAxis: { title: { text: "收入趋势" }, alias: "收入" },
  point: {
    size: 3,
    shape: "circle",
    style: {
      fill: "white",
      stroke: "#228B22",
      lineWidth: 2,
    },
  },
};

const pieOptions: PieOptions = {
  data: [],
  angleField: "value",
  colorField: "type",
  radius: 1,
  innerRadius: 0.5,
  label: {
    type: "inner",
    offset: "-50%",
    content: (a: any) => {
      return (a.percent * 100).toFixed(2) + "%";
    },
    // content: "{percent}",
    style: {
      textAlign: "center",
      fontSize: 14,
    },
  },
  interactions: [{ type: "element-selected" }, { type: "element-active" }],
  statistic: {
    title: false,
    content: {
      style: {
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "1rem",
      },
      content: "各项收入占比",
    },
  },
  legend: {
    itemName: {
      style: {
        fontSize: 16,
      },
    },
  },
};

const MoneyChart = () => {
  const lineRef = useRef<Line | null>(null);
  const pieRef = useRef<Pie | null>(null);
  const [lineForm] = Form.useForm();
  const [pieForm] = Form.useForm();
  useEffect(() => {
    const initialization = async () => {
      const res = await axios.post(`/api/financial/find`);
      const linePlot = new Line("container", {
        ...lineOptions,
        data: sumTotalByDate(res.data.result),
      });
      const piePlot = new Pie("container2", {
        ...pieOptions,
        data: sumTotalByType(res.data.result),
      });
      lineRef.current = linePlot;
      pieRef.current = piePlot;
      linePlot.render();
      piePlot.render();
    };
    initialization();
  }, []);

  const handleLineFinish = async (params: any) => {
    let res;
    if (params?.line) {
      const [start, end] = params?.line.map((item: Dayjs) =>
        item.format("YYYY-MM-DD")
      );
      res = await axios.post(`/api/financial/queryDateRange`, {
        queryData: [1, start, end],
      });
    } else {
      res = await axios.post(`/api/financial/queryDateRange`, {
        queryData: [2],
      });
    }
    lineRef.current?.changeData(res.data.result);
  };

  const handlePieFinish = async (params: any) => {
    let res;
    if (params.pie) {
      const [start, end] = params.pie.map((item: Dayjs) =>
        item.format("YYYY-MM")
      );
      res = await axios.post(`/api/financial/queryDateRange`, {
        queryData: [3, start, end],
      });
    } else {
      res = await axios.post(`/api/financial/queryDateRange`, {
        queryData: [4],
      });
    }
    pieRef.current?.changeData(res.data.result);
  };

  return (
    <>
      <Form
        layout="inline"
        form={lineForm}
        style={{
          margin: "2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
        onFinish={handleLineFinish}
      >
        <Form.Item
          name={"line"}
          label="时间范围"
          tooltip="默认为空即从医院开始运作到现在"
        >
          <RangePicker />
        </Form.Item>

        <Form.Item>
          <Space size={[30, 0]}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button htmlType="button" onClick={() => lineForm.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div id="container" style={{ height: 256, margin: "1rem" }}></div>
      <Form
        layout="inline"
        form={pieForm}
        style={{
          margin: "2rem",
          display: "flex",
          justifyContent: "space-between",
        }}
        onFinish={handlePieFinish}
      >
        <Form.Item
          name={"pie"}
          label="时间范围"
          tooltip="默认为空即从医院开始运作到现在"
        >
          <RangePicker picker="month" />
        </Form.Item>

        <Form.Item>
          <Space size={[30, 0]}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button htmlType="button" onClick={() => pieForm.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div id="container2" style={{ height: 256, margin: "1rem" }}></div>
    </>
  );
};
export default MoneyChart;
