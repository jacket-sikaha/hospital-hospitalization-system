// import { MongoClient } from "mongodb";
const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri =
  // "mongodb+srv://qwe:qwe@cluster0.gejbp8p.mongodb.net/?retryWrites=true&w=majority";
  `mongodb://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/?authMechanism=DEFAULT`;

async function usersCollection(phone) {
  const client = new MongoClient(uri);
  try {
    const users = client.db("hhs").collection("personnel");
    return await users.findOne(phone);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function usersIsExist(email) {
  const client = new MongoClient(uri);
  try {
    const users = client.db("hhs").collection("personnel");

    return await users.findOne(email);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function insert(obj) {
  const client = new MongoClient(uri);
  try {
    const users = client.db("hhs").collection("personnel");

    return await users.insertOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function update(obj) {
  const client = new MongoClient(uri);
  try {
    const users = client.db("hhs").collection("personnel");

    return await users.updateOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export { insert, usersCollection, update, usersIsExist, uri };
