// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { patientInsert } from "@/lib/sql/patient";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(404).json({ error: "404 not found" });
    return;
  }

  try {
    const data = req.body;
    console.log("data", data);
    const result = await patientInsert(data);
    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
}
