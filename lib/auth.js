import { hash, compare } from "bcryptjs";
// 加密
export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12); // 数字越打越安全，但也越花时间
  return hashedPassword;
}
// 密码校对返回结果
export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}
