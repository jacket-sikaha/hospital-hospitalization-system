// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { bedUpdateMany } from "@/lib/sql/bed";
import { financialInsert } from "@/lib/sql/financial";
import { findAll, medicalRecordUpdate } from "@/lib/sql/mr";
import { patientUpdate } from "@/lib/sql/patient";
import { drugType, mrType } from "@/pages/dataType";
import { faker } from "@faker-js/faker";
import Big from "big.js";
import dayjs from "dayjs";
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
    let idArr: any[] = [];
    let objArr: any[] = [];
    let financial: any[] = [];
    let pidArr: any[] = [];
    let dischargeDate = arr[0].dischargeDate;
    console.log("arr", arr);
    // 三项指标确认唯一一个mr
    const result = await findAll(1, 1000, {
      $or: arr.map((bed: any) => ({
        bed_name: bed.bed_name,
        name: bed.name,
        admission_date: bed.admission_date,
      })),
    });
    // console.log("result", result);
    if (result.length !== arr.length) {
      throw new Error("数据异常");
    }
    objArr = result.map(({ _id, pid, admission_date, money, name }, index) => {
      idArr.push(_id);
      pidArr.push(pid);
      let hospitalization =
        dayjs(dischargeDate).diff(admission_date, "day") * 100;
      let examination = faker.datatype.number({
        min: 100,
        max: 10000,
        precision: 0.01,
      });
      let cure = faker.datatype.number({
        min: 100,
        max: 1000,
        precision: 0.01,
      });
      let newMoney = {
        ...money,
        hospitalization,
        examination,
        cure,
        // total: money?.medication || 0 + hospitalization + examination + cure,
        total: new Big(money?.medication || 0)
          .plus(new Big(hospitalization))
          .plus(new Big(examination))
          .plus(new Big(cure))
          .toNumber(),
      };
      financial.push({
        ...newMoney,
        pid,
        mrid: _id.toString(),
        name,
        date: dischargeDate,
      });
      return {
        readyAdmission: 0,
        dischargeDate,
        money: newMoney,
      };
    });

    const data = await Promise.all([
      bedUpdateMany(
        null,
        { patient_id: undefined },
        {
          $or: arr.map((bed: { bed_name: any }) => ({
            bed_name: bed.bed_name,
          })),
        }
      ),
      ...idArr.map((id, index) => medicalRecordUpdate(id, objArr[index])),
      ...pidArr.map((id) =>
        patientUpdate(id, { readyAdmission: 0, admission_date: undefined })
      ),
      financialInsert(financial),
    ]);
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }
}
