import { uri } from "../db";
const { MongoClient, ObjectId } = require("mongodb");

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

// 分页查询
async function findAll(page, pageSize) {
  const client = new MongoClient(uri);
  pageSize = parseInt(pageSize);
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

async function drugDelete(_id) {
  const client = new MongoClient(uri);
  try {
    const drugs = client.db("hhs").collection("medicine");

    return await drugs.deleteOne({ _id: new ObjectId(_id) });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function drugUpdate(id, record) {
  const client = new MongoClient(uri);
  try {
    const drugs = client.db("hhs").collection("medicine");
    return await drugs.updateOne({ _id: new ObjectId(id) }, { $set: record });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export { drugCount, findAll, drugDelete, drugUpdate };
