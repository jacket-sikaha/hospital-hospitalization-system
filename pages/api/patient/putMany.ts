// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { patientUpdateMany } from "@/lib/sql/patient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.status(404).json({ error: "404 not found" });
    return;
  }

  try {
    const { selKey, update } = req.body;
    if (!selKey?.length) {
      throw new Error("条件不足!");
    }
    const data = await patientUpdateMany(selKey, update);

    console.log("data", data);
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
