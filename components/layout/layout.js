import { useRouter } from "next/dist/client/router";
import { Fragment } from "react";
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
import Image from "next/image";
import MainNavigation from "./main-navigation";
import { items, items2 } from "./menuItem";
const { Header, Sider, Content } = Layout;

// <List.Item>我的个人资料</List.Item>
// 退出

const DashboardLayout = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // useRouter来控制布局展示
  const { pathname } = useRouter();
  if (pathname.slice(1) === "" || pathname.slice(1) === "login") {
    return <main>{props.children}</main>;
  }
  return (
    <Fragment>
      <Layout
        style={{
          height: "100vh",
        }}
      >
        {/* <Header className="header">
          <Image
            src="/豆浆.png"
            alt="icon"
            style={{ display: "block" }}
            width={56}
            height={56}
          />

          <Dropdown menu={{ MenuItems }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                  // src="https://joesch.moe/api/v1/random"
                />
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          {/* <Row>
            <Col span={22}>
              <Space style={{ width: "50vw" }}>
                <Image
                  src="/豆浆.png"
                  alt="icon"
                  style={{ display: "block" }}
                  width={56}
                  height={56}
                />
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={["app"]}
                  items={items}
                />
              </Space>
            </Col>
            <Col span={2}>
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
                // src="https://joesch.moe/api/v1/random"
              />
              <Dropdown menu={{ MenuItems }}>
                <DownOutlined style={{ backgroundColor: "#ffffff" }} />
              </Dropdown>
            </Col>
          </Row> 
        </Header> 
        */}
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
