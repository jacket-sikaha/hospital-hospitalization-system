import { uri } from "../db";
const { MongoClient, ObjectId } = require("mongodb");

// 分页查询
async function findAll(page = 1, pageSize = 1000, filters) {
  const client = new MongoClient(uri);
  pageSize = parseInt(pageSize);
  try {
    const money = client.db("hhs").collection("financial");
    return await money
      .find(filters)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function financialInsert(obj) {
  const client = new MongoClient(uri);
  try {
    const money = client.db("hhs").collection("financial");
    return await money.insertMany(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export { financialInsert, findAll };
