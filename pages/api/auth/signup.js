import { hashPassword } from "../../../lib/auth";
import { usersCollection, insert } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        "Invalid input - password should also be at least 7 characters long.",
    });
    return;
  }

  const existingUser = await usersCollection({ email: email });

  if (existingUser) {
    res.status(422).json({ message: "User exists already!" });
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await insert({
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Created user!" });
}

export default handler;
