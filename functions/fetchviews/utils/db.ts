import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environment variable");
}

type HitResult = {
  slug: string;
  hits: number;
};

export const fetchPageViews = async (): Promise<HitResult[]> => {
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

    const cursor = collection.find();
    const hits: HitResult[] = [];
    // iterate over the cursor using await...of
    for await (const doc of cursor) {
      hits.push({ slug: doc.slug, hits: doc.hits });
    }

    return hits;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    }
    throw err;
  } finally {
    await client.close();
  }
};
