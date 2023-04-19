type patientType = {
  id?: string;
  _id?: string;
  name: string;
  age: string;
  gender?: string;
  phone: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  admission_date?: string;
  address?: string;
  readyAdmission?: boolean | number | string; // 0是未住院 1待住院批准 2住院ing
  patientColor?: string;
};
