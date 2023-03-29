const nodemailer = require("nodemailer");
//qq邮箱
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (code, email) => {
  await transporter.verify((error, success) => {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("服务器已准备好接收我们的消息");
    }
  });

  await transporter.sendMail(
    {
      from: process.env.EMAIL_FROM,
      to: email || "sikara@163.com" || "2522754658@qq.com",
      subject: "HHS系统 发送电子邮件", // 邮件标题
      text: "验证码为：" + code, // 邮件内容，code 为发送的验证码信息，这里的内容可以自定义
      html: `<b>嘿! </b><br> 这是我使用 Nodemailer 发送的第一条消息🎉👏 验证码为：${code}`,
    },
    (error, info) => {
      if (error) {
        console.log("Error occurred");
        console.log(error.message);
        throw error;
      }

      console.log("Message sent successfully!");
      console.log(nodemailer.getTestMessageUrl(info));

      // only needed when using pooled connections
      transporter.close();
    }
  );
};

export { sendMail };
