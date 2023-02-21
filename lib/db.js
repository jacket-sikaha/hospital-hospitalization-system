import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://sikaha:xuhaoxian@cluster0.gejbp8p.mongodb.net/?retryWrites=true&w=majority"
    );

    return client;
  } catch (error) {
    throw error.name;
  }
}
