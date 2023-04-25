import { uri } from "../db";
const { MongoClient, ObjectId } = require("mongodb");

// 分页查询
async function findAll(page = 1, pageSize = 100, filters) {
  const client = new MongoClient(uri);
  pageSize = parseInt(pageSize);
  try {
    const medicalRecords = client.db("hhs").collection("medicalRecord");
    return await medicalRecords
      .find(filters)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function medicalRecordUpdate(id, record) {
  const client = new MongoClient(uri);
  try {
    const medicalRecords = client.db("hhs").collection("medicalRecord");
    // findOneAndUpdate 返还更新的结果数据 updateOne则不会
    return await medicalRecords.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: record }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function medicalRecordUpdateByOther(selKey, update) {
  const client = new MongoClient(uri);
  try {
    const medicalRecords = client.db("hhs").collection("medicalRecord");
    return await medicalRecords.findOneAndUpdate(selKey, { $set: update });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function medicalRecordInsert(obj) {
  const client = new MongoClient(uri);
  try {
    const medicalRecords = client.db("hhs").collection("medicalRecord");
    // obj._id = new ObjectId(obj._id);
    return await medicalRecords.insertOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export {
  medicalRecordInsert,
  findAll,
  medicalRecordUpdate,
  medicalRecordUpdateByOther,
};
