// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sendMail } from "@/lib/emailTransporter";
import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../lib/auth";
import { faker } from "@faker-js/faker";
import { usersIsExist } from "@/lib/db";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(404).json({ error: "404 not found" });
    return;
  }
  try {
    const { email } = req.body;
    const code: string = faker.random.numeric(6);
    const user = await usersIsExist({
      email,
    });

    if (!user) {
      throw new Error("No user found!");
    }
    const hashedCode = await hashPassword(code);
    await sendMail(code, email);
    res.status(200).json({ data: "success", hashedCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
