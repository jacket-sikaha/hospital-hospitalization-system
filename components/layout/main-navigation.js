import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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
  List,
  Row,
  Space,
  Layout,
  Menu,
  Divider,
  Popover,
  Dropdown,
  Button,
} from "antd";
import Image from "next/image";
import { layoutItems } from "./menuItem";
import classes from "./main-navigation.module.css";
import { useRef } from "react";

function MainNavigation() {
  // 使用useSession会发送一个请求/api/auth/session 以检查是否该会话cookie是否有效
  const { data: session, status } = useSession();
  const loading = status === "loading";

  function logoutHandler() {
    signOut();
  }

  const headerRef = useRef();
  return (
    <header className={classes.header} ref={headerRef}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          // border: "1px solid black",
        }}
      >
        <Link href="/">
          <div className={classes.logo}>
            <Image
              src="/豆浆.png"
              alt="icon"
              style={{ display: "block" }}
              width={56}
              height={56}
            />
          </div>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["app"]}
          items={layoutItems}
        />
      </div>
      <Popover
        content={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // border: "1px solid black",
            }}
          >
            <Button type="text">我的个人资料</Button>
            <Button type="text">123</Button>
            <Button type="text">qwrq</Button>
            <Button type="text" danger onClick={logoutHandler}>
              退出
            </Button>
          </div>
        }
      >
        <div>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
            // src="https://joesch.moe/api/v1/random"
          />
          {/* <DownOutlined /> */}
        </div>
      </Popover>
    </header>
  );
}

export default MainNavigation;
