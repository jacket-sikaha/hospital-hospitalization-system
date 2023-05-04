import Big from "big.js";
import dayjs from "dayjs";

function sumTotalByDate(data) {
  const result = [];
  const map = new Map(); // 用于存储某一天的所有记录

  // 将记录按日期分类
  data.forEach((item) => {
    // const date = item.date.substr(0, 10); // 取出年月日部分作为键
    const date = item.date;
    if (map.has(date)) {
      map.get(date).push(item);
    } else {
      map.set(date, [item]);
    }
  });

  // 遍历日期，将同一天的记录汇总为一条记录
  Array.from(map.keys())
    .sort()
    .forEach((date) => {
      let items = map.get(date);
      items = items.map(({ total }) => new Big(total));
      const total = items.reduce((acc, cur) => acc.plus(cur));
      result.push({ date: date, total: total.toNumber() });
    });

  return result;
}

function sumTotalByType(data) {
  const result = ["用药费用", "住院费用", "医疗检查费用", "治疗费用"];
  //   let medicationArr = [];
  //   let hospitalizationArr = [];
  //   let examinationArr = [];
  //   let cureArr = [];
  let tmp = [[], [], [], []];
  // 将记录按日期分类
  data.forEach(({ medication, hospitalization, examination, cure }) => {
    tmp[0].push(new Big(medication || 0));
    tmp[1].push(new Big(hospitalization));
    tmp[2].push(new Big(examination));
    tmp[3].push(new Big(cure));
  });

  return result.map((key, i) => ({
    type: key,
    value: tmp[i].reduce((acc, cur) => acc.plus(cur)).toNumber(),
  }));
}
export { sumTotalByDate, sumTotalByType };
