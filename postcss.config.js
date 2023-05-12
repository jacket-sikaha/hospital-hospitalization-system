module.exports = {
  plugins: [
    ["postcss-preset-env", {}],
    [
      "postcss-custom-properties",
      {
        importFrom: [
          "./node_modules/antd-mobile/es/components/avatar/avatar.css",
        ],
      },
    ],
  ],
};
