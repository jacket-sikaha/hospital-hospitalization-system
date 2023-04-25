// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { drugCount, findAll } from "@/lib/sql/drug";
import type { NextApiRequest, NextApiResponse } from "next";

function parse(data: any) {
  // json不支持传输 RegExp 类型
  if (Object.keys(data).length === 0) {
    return;
  }
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // 处理成正则表达式形式达成模糊查询效果
      data[key] = new RegExp(data[key]);
    }
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, pageSize }: any = req.query;
  // get方法不能用body放数据
  const { queryData } = req.body;
  parse(queryData);
  // console.log("queryData", queryData);
  try {
    const total = await drugCount();
    if (!total) {
      throw new Error("no data!");
    }
    const result = await findAll(page, pageSize, queryData);
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

    res.status(200).json({
      data: result,
      total: Object.keys(queryData).length > 0 ? result.length : total,
      page,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
