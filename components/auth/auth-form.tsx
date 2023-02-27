import {
  GithubFilled,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import {
  LoginFormPage,
  ModalForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormInstance,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Divider, message, Space, Tabs } from "antd";
import { CSSProperties, useRef } from "react";
import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
type LoginType = "phone" | "account" | "register";

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

async function createUser(email: string, password: string) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

export default function AuthForm() {
  const restFormRef = useRef<ProFormInstance>();
  const formRef = useRef<ProFormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [loginType, setLoginType] = useState<LoginType>("account");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function submitHandler(username: string, password: string) {
    const enteredEmail = username;
    const enteredPassword = password;

    // optional: Add validation
    const result: unknown = await signIn("credentials", {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (!result.error) {
      // set some auth state
      message.success("提交成功");
      router.replace("/profile");
    } else {
      message.error(result.error);
    }
  }

  useEffect(() => {
    // 保护登录页 当我们登陆后就无需在访问该页面
    // 防止用户使用地址栏的url进行跳转 会话存在时进行重定向
    getSession().then((session) => {
      if (session) {
        router.replace("/asd");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "calc(100vh - 16px)",
        // margin: -24,
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
        title="欢迎使用HHS系统"
        subTitle="开发者：许浩贤（Sikara）"
        activityConfig={{
          style: {
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
            color: "#fff",
            borderRadius: 8,
            backgroundColor: "#1677FF",
            // fontSize: 6,
          },
          // title: "欢迎使用HHS系统",
          subTitle: "我们奋力前行，小舟逆水而上，不断地被浪潮推回到过去。",
          action: (
            <ModalForm
              title="注册"
              formRef={restFormRef}
              open={modalVisible}
              trigger={
                <Button
                  type="primary"
                  style={{
                    borderRadius: 20,
                    background: "#fff",
                    color: "#1677FF",
                    width: 120,
                  }}
                  onClick={() => {
                    setModalVisible(true);
                  }}
                >
                  注册
                </Button>
              }
              onOpenChange={setModalVisible}
              submitter={{
                searchConfig: {
                  resetText: "重置",
                },
                resetButtonProps: {
                  onClick: () => {
                    restFormRef.current?.resetFields();
                    //   setModalVisible(false);
                  },
                },
              }}
              onFinish={async ({ enteredEmail, enteredPassword }) => {
                try {
                  const result = await createUser(
                    enteredEmail,
                    enteredPassword
                  );
                  message.success("提交成功");

                  return true;
                } catch (error) {
                  message.error(error);
                  return false;
                }
              }}
            >
              <ProFormText
                width="md"
                name="enteredEmail"
                label="用户名"
                // tooltip="最长为 16 位"
                placeholder="请输入用户名"
              />

              <ProFormText
                width="md"
                name="enteredPassword"
                label="密码"
                placeholder="请输入密码"
              />
            </ModalForm>
          ),
        }}
        actions={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Divider plain>
              <span
                style={{ color: "#CCC", fontWeight: "normal", fontSize: 14 }}
              >
                其他登录方式
              </span>
            </Divider>
            <Space align="center" size={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: 40,
                  width: 40,
                  border: "1px solid #D4D8DD",
                  borderRadius: "50%",
                }}
              >
                <GithubFilled style={{ ...iconStyles, color: "#000000" }} />
              </div>
              {/* <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: 40,
                  width: 40,
                  border: "1px solid #D4D8DD",
                  borderRadius: "50%",
                }}
              >
                <TaobaoOutlined style={{ ...iconStyles, color: "#FF6A10" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  height: 40,
                  width: 40,
                  border: "1px solid #D4D8DD",
                  borderRadius: "50%",
                }}
              >
                <WeiboOutlined style={{ ...iconStyles, color: "#333333" }} />
              </div> */}
            </Space>
          </div>
        }
        onFinish={async (values) => {
          const { username, password } = values;
          await submitHandler(username, password);
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
          <Tabs.TabPane key={"phone"} tab={"手机号登录"} />
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名: email"}
              rules={[{ required: true, message: "请输入用户名!" }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码:"}
              rules={[{ required: true, message: "请输入密码！" }]}
            />
          </>
        )}
        {loginType === "phone" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined className={"prefixIcon"} />,
              }}
              name="mobile"
              placeholder={"手机号"}
              rules={[
                { required: true, message: "请输入手机号！" },
                { pattern: /^1\d{10}$/, message: "手机号格式错误！" },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              captchaProps={{
                size: "large",
              }}
              placeholder={"请输入验证码"}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${"获取验证码"}`;
                }
                return "获取验证码";
              }}
              name="captcha"
              rules={[{ required: true, message: "请输入验证码！" }]}
              onGetCaptcha={async () => {
                message.success("获取验证码成功！验证码为：1234");
              }}
            />
          </>
        )}

        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: "right",
            }}
          >
            忘记密码请联系管理员
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
}
