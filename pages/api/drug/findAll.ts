// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { drugCount, findAll } from "@/lib/sql/drug";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let { page, pageSize } = req.query;
  pageSize = parseInt(pageSize);
  try {
    const total = await drugCount();
    if (!total) {
      throw new Error("no data!");
    }
    const result = await findAll(page, pageSize);
    res.status(200).json({ data: result, total, page });
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
}
