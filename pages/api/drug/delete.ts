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
    const { _id } = req.body;

    const data = await drugDelete(_id);
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
}
