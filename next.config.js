/** @type {import('next').NextConfig} */
// const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
// PHASE_PRODUCTION_BUILD npm run build 后使用
// PHASE_PRODUCTION_SERVER; 生产服务器启动并运行后使用
const nextConfig = (phase) => {
  // 如果是开发环境
  // if (phase === PHASE_DEVELOPMENT_SERVER) {
  return {
    // 在 Next.js 中使用 antd-mobile 需要做一些额外的配置
    transpilePackages: ["antd-mobile"],
    // reactStrictMode: true,
    env: {
      mongodb_username: "sikara",
      mongodb_password: "sikara",
      mongodb_clustername: "cluster0",
      mongodb_database: "my-site-dev",
      MONGODB_HOST: "xxxxx",
      MONGODB_PORT: "xxxx",
      SMTP_USER: "xxxx",
      SMTP_PASSWORD: "xxxxx",
      SMTP_HOST: "smtp.qq.com", //'smtp.163.com' 163 email
      SMTP_PORT: 587,
      EMAIL_FROM: "xxxxx",
      SECRET: "sikara",
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  };
  // }
};

module.exports = nextConfig;
