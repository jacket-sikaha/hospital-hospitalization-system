import { uri } from "../db";
const { MongoClient } = require("mongodb");

async function drugCount() {
  const client = new MongoClient(uri);
  try {
    const drugs = await client.db("hhs").collection("medicine");

    return await drugs.countDocuments();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

console.log("drugCount", drugCount());
export { drugCount };
