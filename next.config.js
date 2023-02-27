/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
// PHASE_PRODUCTION_BUILD npm run build 后使用
// PHASE_PRODUCTION_SERVER; 生产服务器启动并运行后使用
const nextConfig = (phase) => {
  // 如果是开发环境
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      env: {
        mongodb_username: "maximilian",
        mongodb_password: "xxxxxxxxxxxx",
        mongodb_clustername: "cluster0",
        mongodb_database: "my-site-dev",
      },
    };
  }
  return {
    reactStrictMode: true,
    // 环境变量配置 一次配置 全局复用、
    // ！！！！！！但需要注意一点：后面部署需要上传到GitHub仓库，
    // 而该文件需要考虑安全问题，携带了重要信息，push的时候需要三思而行
    // 对于开源的部署项目，建议交由部署的工具来安全配置内置的环境变量
    env: {
      mongodb_username: "xxxxx",
      mongodb_password: "xxxxxxxxxxx",
      mongodb_clustername: "xxxxxxx",
    },
  };
};

module.exports = nextConfig;
