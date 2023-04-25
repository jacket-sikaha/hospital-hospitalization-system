import { medicalRecordUpdateByOther } from "@/lib/sql/mr";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.status(404).json({ error: "404 not found" });
    return;
  }

  try {
    const { selKey, update } = req.body;
    console.log(selKey, update);
    const { name, bed_name, readyAdmission } = selKey;
    if (!(name && bed_name && readyAdmission)) {
      throw new Error("条件不足!");
    }
    const data = await medicalRecordUpdateByOther(selKey, update);
    if (!data.value) {
      throw new Error("update error!");
    }
    res.status(200).json({ data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
