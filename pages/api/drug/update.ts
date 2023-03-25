// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { drugCount, drugUpdate } from "@/lib/sql/drug";
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
    const { record } = req.body;
    const id = record._id;
    delete record._id;
    const data = await drugUpdate(id, record);
    if (!data.value) {
      throw new Error("update error!");
    }
    const total = await drugCount();
    res.status(200).json({ data, total });
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
}
