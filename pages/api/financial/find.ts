import { findAll } from "@/lib/sql/financial";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, pageSize }: any = req.query;
  // get方法不能用body放数据
  const { queryData } = req.body;
  try {
    const result = await findAll(page, 1000, queryData);

    res.status(200).json({
      result,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
