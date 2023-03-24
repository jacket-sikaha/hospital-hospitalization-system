// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { drugCount, findAll } from "@/lib/sql/drug";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, pageSize } = req.query;
  try {
    const total = await drugCount();
    if (!total) {
      throw new Error("no data!");
    }
    const result = await findAll(page, pageSize);
    // const result: any[] = [];
    // for (let i = 0; i < 61; i++) {
    //   result.push({
    //     _id: i,
    //     name: i,
    //     specification: i,
    //     price: i,
    //     manufacturer: i,
    //     inventory: i,
    //     incomingTime: i,
    //     outboundTime: i,
    //   });
    // }

    res.status(200).json({ data: result, total, page });
  } catch (e) {
    res.status(500).json({ error: e.message });
    return;
  }
}
