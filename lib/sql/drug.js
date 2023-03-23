import { uri } from "../db";
const { MongoClient } = require("mongodb");

async function drugCount() {
  const client = new MongoClient(uri);
  try {
    const drugs = client.db("hhs").collection("medicine");

    return await drugs.countDocuments();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function findAll(page, pageSize) {
  const client = new MongoClient(uri);
  try {
    const drugs = client.db("hhs").collection("medicine");

    return await drugs
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export { drugCount, findAll };
