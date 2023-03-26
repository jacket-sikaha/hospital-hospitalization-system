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

async function drugInsert(obj) {
  const client = new MongoClient(uri);
  try {
    const drugs = client.db("hhs").collection("medicine");
    // obj._id = new ObjectId(obj._id);
    return await drugs.insertOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// 分页查询
async function findAll(page, pageSize, filters) {
  const client = new MongoClient(uri);
  pageSize = parseInt(pageSize);
  try {
    const drugs = client.db("hhs").collection("medicine");
    return await drugs
      .find(filters)
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
    // findOneAndUpdate 返还更新的结果数据 updateOne则不会
    return await drugs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: record }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export { drugCount, drugInsert, findAll, drugDelete, drugUpdate };
