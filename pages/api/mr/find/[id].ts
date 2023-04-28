import { findAll } from "@/lib/sql/mr";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, pageSize, id }: any = req.query;
  // get方法不能用body放数据
  try {
    const result = (await findAll(page, 1000, { _id: new ObjectId(id) }))[0];

    res.status(200).json({
      result,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
