import { uri } from "../db";
const { MongoClient, ObjectId } = require("mongodb");

async function bedCount() {
  const client = new MongoClient(uri);
  try {
    const beds = client.db("hhs").collection("bed");

    return await beds.countDocuments();
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
    const beds = client.db("hhs").collection("bed");
    return await beds
      .find(filters)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function bedUpdate(id, record) {
  const client = new MongoClient(uri);
  try {
    const beds = client.db("hhs").collection("bed");
    // findOneAndUpdate 返还更新的结果数据 updateOne则不会
    return await beds.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: record }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function bedUpdateMany(selKey, update, otherFilter) {
  const client = new MongoClient(uri);
  try {
    const beds = client.db("hhs").collection("bed");
    let keyFilter = {};
    if (otherFilter) {
      keyFilter = { ...otherFilter };
    }
    keyFilter._id = { $in: selKey.map((obj) => new ObjectId(obj)) };
    // findOneAndUpdate 返还更新的结果数据 updateOne则不会
    return await beds.updateMany(keyFilter, { $set: update });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export { bedCount, findAll, bedUpdate, bedUpdateMany };
