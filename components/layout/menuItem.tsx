import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  BankOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "next/link";
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
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

export { items, items2 };
