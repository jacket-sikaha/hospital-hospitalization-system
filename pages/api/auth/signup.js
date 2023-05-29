import { hashPassword } from "../../../lib/auth";
import { usersIsExist, insert, usersCollection } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  const { phone, email, password } = data;
  console.log("password", data);
  // if (
  // !email ||
  // !email.includes("@") ||
  // !password ||
  // password.trim().length < 6
  // ) {
  //   res.status(422).json({
  //     message:
  //       "Invalid input - password should also be at least 6 characters long.",
  //   });
  //   return;
  // }

  const existingUser = await usersIsExist({ email });
  const existingUser2 = await usersCollection({ phone });

  if (existingUser || existingUser2) {
    res.status(422).json({ message: "User exists already!" });
    return;
  }

  const hashedPassword = await hashPassword(password);
  // collections: {
  //   Users: {
  //     name: "users",
  //     option: {
  //       username: "<string>",
  //       email: "<string>",
  //       emailVerified: "<string>",
  //       password: "<string>",
  //       image: "<string>",
  //       type: "<string>",
  //     },
  //   },
  // },
  const result = await insert({
    email,
    password: hashedPassword,
    image: "",
    type: 0,
    phone,
    username: email,
  });
  console.log("result", result);
  res.status(201).json({ message: "Created user!" });
}

export default handler;
