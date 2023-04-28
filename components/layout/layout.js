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
import { menuItems } from "./menuItem";
const { Sider, Content } = Layout;

// <List.Item>我的个人资料</List.Item>
// 退出

const DashboardLayout = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();
  useEffect(() => {
    getSession().then((session) => {
      console.log("session", session);
      if (!session) {
        router.replace("/login");
      }
    });
    // 加上router依赖项确保每次url发生变化都能进行session的时效性检验
    // ？？？？？？这部分写在app入口页面 会有不断刷新调用的问题
  }, [router]);

  // // useRouter来控制布局展示
  // const { pathname } = router;
  // if (pathname.slice(1) === "" || pathname.slice(1) === "login") {
  //   return <main>{props.children}</main>;
  // } else {
  //   getSession().then((session) => {
  //     if (!session) {
  //       router.replace("/login");
  //       console.log("session", session);
  //     }
  //   });
  // }

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
              items={menuItems}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              style={{
                padding: 24,
                marginTop: "26px",
                minHeight: 280,
                background: colorBgContainer,
                overflowY: "auto",
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
