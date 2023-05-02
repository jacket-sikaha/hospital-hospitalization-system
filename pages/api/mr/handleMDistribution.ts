// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { medicalRecordUpdate } from "@/lib/sql/mr";
import { drugType, mrType } from "@/pages/dataType";
import { Faker, faker } from "@faker-js/faker";
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
    const arr = req.body;
    let idArr: string[] = [];
    arr.forEach((record: any) => {
      let medication = 0;
      record.Medication.forEach((element: drugType) => {
        element.status = true;
        medication +=
          (element.price || 10) *
          (element.use_count || parseInt(faker.random.numeric(1)) + 1);
      });
      idArr.push(record._id);
      record.money = { medication };
      delete record._id;
    });
    // console.log("arr", arr);

    const data = await Promise.all(
      idArr.map((id, index) => medicalRecordUpdate(id, arr[index]))
    );
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
