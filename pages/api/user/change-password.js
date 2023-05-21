import { getSession } from "next-auth/react";

import { hashPassword, verifyPassword } from "../../../lib/auth";
import { update, usersIsExist } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  // 检验我们请求里的一部分 是否能经过身份验证
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  // const client = await connectToDatabase();

  // const usersCollection = client.db().collection("users");

  // const user = await usersCollection.findOne({ email: userEmail });
  const user = await usersIsExist({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password." });
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  // $set 匹配对象里的一个key 根据这个key来更新其属性 其他key的值不受影响
  // 如果传入一个新key 则相当于添加一个新的键值对
  const result = await update(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  res.status(200).json({ message: "Password updated!" });
}

export default handler;
