import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  BankOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  ContainerOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "next/link";

const moduleHHS = [
  { label: "用户管理", childrens: [{ link: "asd", subLabel: "用户信息" }] },
  {
    label: "入院管理",
    childrens: [
      { link: "DrugDistribution", subLabel: "病人信息录入" },
      { link: "", subLabel: "分配科室病床" },
    ],
  },
  {
    label: "科室管理",
    childrens: [
      { link: "", subLabel: "医生工作站" },
      { link: "", subLabel: "护士工作站" },
    ],
  },
  {
    label: "药房管理",
    childrens: [
      { link: "DrugDistribution", subLabel: "药品分配" },
      { link: "DrugManagement", subLabel: "药品管理" },
    ],
  },
  {
    label: "财务管理",
    childrens: [{ link: "", subLabel: "费用结算" }],
  },
  {
    label: "出院管理",
    childrens: [{ link: "", subLabel: "出院手续管理" }],
  },
];

const items: MenuProps["items"] = [
  {
    label: <Link href="/">欢迎页</Link>,
    key: "mail",
    icon: <BankOutlined />,
  },
  {
    label: "管理主页",
    key: "app",
    icon: <AppstoreOutlined />,
  },
];

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  PieChartOutlined,
  ContainerOutlined,
  MailOutlined,
].map((icon, index) => {
  const key = String(index + 1);
  const { label, childrens } = moduleHHS[index];

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: label,
    // children: new Array(4).fill(null).map((_, j) => {
    //   const subKey = index * 4 + j + 1;
    //   return {
    //     key: subKey,
    //     label: `option${subKey}`,
    //   };
    // }),
    children: childrens.map((val, j) => {
      const subKey = index + j + 1;
      const { link, subLabel } = val;
      return {
        key: subKey,
        label: <Link href={link ? `/${link}` : "/"}>{subLabel}</Link>,
      };
    }),
  };
});

export { items, items2 };
