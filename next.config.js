/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
// PHASE_PRODUCTION_BUILD npm run build 后使用
// PHASE_PRODUCTION_SERVER; 生产服务器启动并运行后使用

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = (phase) => {
  // 如果是开发环境
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return withBundleAnalyzer({
      // 在 Next.js 中使用 antd-mobile 需要做一些额外的配置
      transpilePackages: ["antd-mobile"],
      // reactStrictMode: true,
      env: {
        mongodb_username: "sikara",
        mongodb_password: "sikara",
        mongodb_clustername: "cluster0",
        mongodb_database: "my-site-dev",
        SMTP_HOST: "smtp.qq.com", //'smtp.163.com' 163 email
        SMTP_PORT: 587,
        SECRET: "sikara",
      },
      typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
    });
  } else {
    return {
      // 在 Next.js 中使用 antd-mobile 需要做一些额外的配置
      transpilePackages: ["antd-mobile"],
      // reactStrictMode: true,
      env: {
        mongodb_username: "sikara",
        mongodb_password: "sikara",
        mongodb_clustername: "cluster0",
        mongodb_database: "my-site-dev",
        SMTP_HOST: "smtp.qq.com", //'smtp.163.com' 163 email
        SMTP_PORT: 587,
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
  }
};

module.exports = nextConfig;
