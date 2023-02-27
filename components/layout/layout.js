import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import React from "react";
import {
  SmileOutlined,
  NotificationOutlined,
  UserOutlined,
  BankOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  MenuProps,
  Row,
  Space,
  Layout,
  Menu,
  theme,
  Popover,
  Dropdown,
  Button,
} from "antd";
import MainNavigation from "./main-navigation";
import { getSession } from "next-auth/react";
import { items, items2 } from "./menuItem";
const { Sider, Content } = Layout;

// <List.Item>我的个人资料</List.Item>
// 退出

const DashboardLayout = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();

  2;

  // useRouter来控制布局展示
  const { pathname } = router;
  if (pathname.slice(1) === "" || pathname.slice(1) === "login") {
    return <main>{props.children}</main>;
  } else {
    getSession().then((session) => {
      if (!session) {
        // router.replace("/login");
        console.log("session", session);
      }
    });
  }
  return (
    <Fragment>
      <Layout
        style={{
          height: "100vh",
        }}
      >
        <MainNavigation />
        <Layout>
          <Sider
            width={200}
            style={{ background: colorBgContainer }}
            breakpoint="lg"
            collapsedWidth="50"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
              items={items2}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              style={{
                padding: 24,
                marginTop: "26px",
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              <main>{props.children}</main>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default DashboardLayout;
