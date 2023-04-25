// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { drugCount, drugDelete, findAll } from "@/lib/sql/drug";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.status(404).json({ error: "404 not found" });
    return;
  }

  try {
    const { id } = req.body;

    const data = await drugDelete(id);
    if (!data.deletedCount) {
      throw new Error("update error!");
    }
    const total = await drugCount();
    res.status(200).json({ data, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
