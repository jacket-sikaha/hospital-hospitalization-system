import { bedUpdate, bedUpdateMany } from "@/lib/sql/bed";
import { patientUpdateMany } from "@/lib/sql/patient";
import { medicalRecordInsert } from "@/lib/sql/mr";
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
    const { bed, patient, mr } = req.body;
    console.log("mr ", bed, patient, mr);
    if (!bed.selKey.length || !patient.selKey.length) {
      throw new Error("条件不足!");
    }

    const result = await Promise.all([
      bed.selKey.map((_: any, i: string | number) =>
        bedUpdate(bed.selKey[i], bed.update[i])
      ),
      patientUpdateMany(patient.selKey, patient.update),
      mr.map((obj: any) => medicalRecordInsert(obj)),
    ]);
    console.log("res", result);
    res.status(200).json({ result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
