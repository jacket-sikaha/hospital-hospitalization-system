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
import axios from "axios";
type LoginType = "phone" | "account" | "register";

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

async function createUser(phone: string, email: string, password: string) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ phone, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    message.error(data.message);
    throw new Error(data.message || "Something went wrong!");
  }
  message.success("提交成功");
  return data;
}

export default function AuthForm() {
  const restFormRef = useRef<ProFormInstance>();
  const formRef = useRef<ProFormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loginType, setLoginType] = useState<LoginType>("account");
  const code = useRef<string>(null);
  const router = useRouter();
  async function submitHandler(key: string, obj: object) {
    // optional: Add validation"credentials"
    const result: unknown = await signIn(key, {
      redirect: false,
      ...obj,
    });

    if (!result.error) {
      // set some auth state
      message.success("提交成功");
      router.replace("/asd");
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
              onFinish={async ({ username, enteredEmail, enteredPassword }) => {
                try {
                  const result = await createUser(
                    username,
                    enteredEmail,
                    enteredPassword
                  );
                  return true;
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <ProFormText
                width="md"
                name="username"
                label="手机号"
                // tooltip="最长为 16 位"
                placeholder="请输入手机号"
                rules={[
                  { required: true, message: "请输入手机号!" },
                  { pattern: /^1\d{10}$/, message: "手机号格式错误！" },
                ]}
              />
              <ProFormText
                width="md"
                name="enteredEmail"
                label="邮箱"
                // tooltip="最长为 16 位"
                placeholder="请输入邮箱"
                rules={[
                  { required: true, message: "请输入邮箱!" },
                  {
                    pattern:
                      /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    message: "邮箱格式错误！",
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="enteredPassword"
                label="密码"
                placeholder="请输入密码"
                rules={[{ required: true, message: "请输入密码!" }]}
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
            {/* <Divider plain>
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
                <GithubFilled
                  style={{ ...iconStyles, color: "#000000" }}
                  onClick={() => signIn("email", { email: "987555458@qq.com" })}
                />
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
              </div> 
            </Space> */}
          </div>
        }
        onFinish={async (values) => {
          const { username, password, email, captcha } = values;
          console.log(values, code);
          email
            ? await submitHandler("emailLogin", {
                code: code.current,
                email,
                captcha,
              })
            : await submitHandler("passwordLogin", { username, password });
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
          <Tabs.TabPane key={"phone"} tab={"邮箱登录"} />
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"手机号: "}
              rules={[
                { required: true, message: "请输入手机号!" },
                // { pattern: /^1\d{10}$/, message: "手机号格式错误！" },
              ]}
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
              name="email"
              placeholder={"邮箱"}
              rules={[
                { required: true, message: "请输入邮箱！" },
                {
                  pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                  message: "邮箱格式错误！",
                },
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
              phoneName="email" //onGetCaptcha的Email得有效 需要设置这个属性（email对应上面的输入框的name）
              placeholder={"请输入验证码"}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${"获取验证码"}`;
                }
                return "获取验证码";
              }}
              name="captcha"
              rules={[{ required: true, message: "请输入验证码！" }]}
              onGetCaptcha={async (email) => {
                try {
                  const { data } = await axios.post("/api/email/sendMail", {
                    email,
                  });
                  code.current = data.hashedCode;
                  message.success("获取验证码成功！");
                } catch (error) {
                  message.error("获取验证码错误！");
                  throw new Error("获取验证码错误");
                }
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
