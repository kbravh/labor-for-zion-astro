import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environment variable");
}

export const logPageView = async (slug: string): Promise<number> => {
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      strict: true,
      deprecationErrors: true,
      version: ServerApiVersion.v1,
    },
  });
  try {
    await client.connect();
    const database = client.db("LaborForZion");
    const collection = database.collection("hits");

    // increment the hits by 1
    await collection.updateOne(
      { slug },
      { $inc: { hits: 1 } },
      { upsert: true },
    );

    // Read the updated hits
    const updatedDoc = await collection.findOne({ slug });
    const count = updatedDoc?.hits || 0;

    // Return total hits
    return count;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    }
    throw err;
  } finally {
    await client.close();
  }
};
