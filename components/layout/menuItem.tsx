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
type MenuItem = Required<MenuProps>["items"][number];

const layoutItems: MenuProps["items"] = [
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

function getItem(
  label: React.ReactNode,
  key: React.Key,
  link?: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    children,
    icon,
    label: link ? <Link href={`/${link}`}>{label}</Link> : label,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem("入院管理", "sub1", "", <LaptopOutlined />, [
    getItem("入院审核", "1", "AdmissionJudgement"),
    getItem("病床分配", "2", "BedAllocation"),
  ]),
  getItem("科室管理", "sub2", "", <NotificationOutlined />, [
    getItem("医嘱开具", "3", "AddMR"), // 分布表单 查=》add
    getItem("病历管理", "4", "MRManagement"), // 查询表单+表格
    getItem("患者管理监控", "5", "PatientManagement"), // 卡片布局+护士todo+患者描述列表详情
  ]),
  getItem("药房管理", "sub3", "", <PieChartOutlined />, [
    getItem("药品分配", "6", "DrugDistribution"),
    getItem("药品管理", "7", "DrugManagement"),
  ]),
  getItem("财务管理", "sub4", "", <ContainerOutlined />, [
    getItem("费用结算", "9"),
  ]),
  getItem("出院管理", "sub5", "", <MailOutlined />, [
    getItem("出院手续管理", "15"),
  ]),
  // getItem("用户管理", "sub6", "",<UserOutlined/>, [
  //   getItem("Option 5", "5"),
  //   getItem("Option 6", "6"),
  // ]),
];

export { layoutItems, menuItems };
