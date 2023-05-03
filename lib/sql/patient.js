import { uri } from "../db";
const { MongoClient, ObjectId } = require("mongodb");

async function patientCount() {
  const client = new MongoClient(uri);
  try {
    const patients = client.db("hhs").collection("patient");

    return await patients.countDocuments();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function patientInsert(obj) {
  const client = new MongoClient(uri);
  try {
    const patients = client.db("hhs").collection("patient");
    // obj._id = new ObjectId(obj._id);
    return await patients.insertOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// 分页查询
async function findAll(page = 1, pageSize = 100, filters) {
  const client = new MongoClient(uri);
  pageSize = parseInt(pageSize);
  try {
    const patients = client.db("hhs").collection("patient");
    return await patients
      .find(filters)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function patientDelete(_id) {
  const client = new MongoClient(uri);
  try {
    const patients = client.db("hhs").collection("patient");

    return await patients.deleteOne({ _id: new ObjectId(_id) });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function patientUpdate(id, record) {
  const client = new MongoClient(uri);
  try {
    const patients = client.db("hhs").collection("patient");
    // findOneAndUpdate 返还更新的结果数据 updateOne则不会
    return await patients.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: record }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function patientUpdateMany(selKey, update, otherFilter) {
  const client = new MongoClient(uri);
  try {
    const patients = client.db("hhs").collection("patient");
    let keyFilter = {};
    if (otherFilter) {
      keyFilter = { ...otherFilter };
    }
    if (selKey?.length > 0) {
      keyFilter._id = { $in: selKey?.map((obj) => new ObjectId(obj)) };
    }
    // findOneAndUpdate 返还更新的结果数据 updateOne则不会
    return await patients.updateMany(keyFilter, { $set: update });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export {
  patientCount,
  patientInsert,
  findAll,
  patientDelete,
  patientUpdate,
  patientUpdateMany,
};
