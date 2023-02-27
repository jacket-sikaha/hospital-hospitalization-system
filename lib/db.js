// import { MongoClient } from "mongodb";
const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://qwe:qwe@cluster0.lrsxvcq.mongodb.net/?retryWrites=true&w=majority";

async function usersCollection(email) {
  const client = new MongoClient(uri);
  try {
    const users = await client.db("hhs").collection("users");

    return await users.findOne(email);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function insert(obj) {
  const client = new MongoClient(uri);
  try {
    const users = await client.db("hhs").collection("users");

    return await users.insertOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function update(obj) {
  const client = new MongoClient(uri);
  try {
    const users = await client.db("hhs").collection("users");

    return await users.updateOne(obj);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export { insert, usersCollection, update };
