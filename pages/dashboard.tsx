import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  BankOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Avatar, Col, MenuProps, Row, Space } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Image from "next/image";
const { Header, Content, Sider } = Layout;

const items: MenuProps["items"] = [
  {
    label: "欢迎页",
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

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Header className="header">
        <Row>
          <Col span={23}>
            <Space size="large">
              <Image
                src="/豆浆.png"
                alt="icon"
                style={{ display: "block" }}
                // fill
                // sizes="2rem"
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
          <Col span={1}>
            <Avatar
              size="large"
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
              // src="https://joesch.moe/api/v1/random"
            />
          </Col>
        </Row>

        {/* <div className="logo" style={{ margin: "auto", width: "56px" }}> */}

        {/* </div> */}
      </Header>
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
          <Breadcrumb style={{ margin: "16px 0" }}>
            {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item> */}
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
