import dayjs from "dayjs";
import { type } from "os";

type patientType = {
  id?: string;
  _id: string;
  name: string;
  age: string;
  gender?: string;
  phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  admission_date: string;
  address?: string;
  // 0是未住院 1待住院批准 2待分配床位 3住院ing
  readyAdmission: boolean | number | string;
  patientColor?: string;
};

interface bedType {
  _id: string;
  id: string;
  department_id: number;
  department_name: string;
  patient_id: number;
  bed_name: string;
}

interface bedOptionsType {
  value: string | number;
  label: string | number;
  id?: string | number;
  disabled?: boolean;
  children?: bedOptionsType[];
}

interface mrType {
  _id: string;
  id: string;
  department_id: number;
  department_name: string;
  bed_name: string;
  pid: number | string;
  bid: number | string;
  name: string;
  age: string;
  gender?: string | number;
  phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  // 0是未住院 1待住院批准 2待分配床位 3住院ing
  readyAdmission: boolean | number | string;
  admission_date: string; // 入院日期
  patientColor?: string;

  problem: string; // 主诉
  diagnostic: string; //诊断
  examination: any[] | undefined; //  医疗化验检查安排
  TPS: any[]; //  治疗计划
  Medication: drugType[]; //  用药安排
  doctor: string;
  createDate: string | dayjs; // mr创建日期
  dischargeDate: string | dayjs; // 出院日期

  children?: undefined | drugType[];
  pname?: string;

  money?: financial;
}

interface drugType {
  id: string;
  _id?: string;
  index?: string | number;
  name?: string; // 药品名称
  specification?: string; // 用药剂量
  price?: number;
  use_count?: number;
  use_time?: number; // 用药频率
  manufacturer?: string;
  pharmacist?: string; //配药的药剂师name
  status: boolean; // 是否分配
  inventory?: number;
  children?: drugType[];
}

interface financial {
  _id: string; // 账单ID
  pid: string; // 病人ID
  mrid: string; // 病历ID
  name: string; // 病人姓名
  date: string; // 付款日期
  medication?: number; // 用药费用
  hospitalization: number; // 住院费用
  examination: number; // 医疗检查费用
  cure: number; //治疗费用
  total: number; // 总共消费
}
