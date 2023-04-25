// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { drugCount, drugDelete, drugInsert, findAll } from "@/lib/sql/drug";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(404).json({ error: "404 not found" });
    return;
  }

  try {
    const { data } = req.body;
    const result = await drugInsert(data);
    const total = await drugCount();
    res.status(200).json({ result, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
