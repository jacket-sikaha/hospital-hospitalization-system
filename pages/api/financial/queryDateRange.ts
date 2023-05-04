import { sumTotalByDate, sumTotalByType } from "@/lib/chart";
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
    const [type, start, end] = queryData;
    console.log(type, start, end);
    if (isNaN(type)) {
      throw new Error("参数异常");
    }
    let result;
    switch (type) {
      case 1:
        result = sumTotalByDate(
          await findAll(page, 1000, {
            date: { $gte: start, $lte: end },
          })
        );
        break;
      case 2:
        result = sumTotalByDate(await findAll(page, 1000));
        break;
      case 3:
        result = sumTotalByType(
          await findAll(page, 1000, {
            date: { $gte: start, $lte: end },
          })
        );
        break;
      default:
        result = sumTotalByType(await findAll(page, 1000));
        break;
    }
    res.status(200).json({
      result,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
