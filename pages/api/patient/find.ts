// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { findAll } from "@/lib/sql/patient";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, pageSize } = req.query;
  // get方法不能用body放数据
  const { queryData } = req.body;
  console.log("queryData", page, pageSize);
  try {
    const result = await findAll(page, pageSize, queryData);

    res.status(200).json({
      result,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
}
