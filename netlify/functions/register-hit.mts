import type {Config, Context} from '@netlify/functions';
import {MongoClient, ServerApiVersion} from 'mongodb';

const {MONGODB_URI} = process.env;
if (!MONGODB_URI) {
  throw new Error('Define the MONGODB_URI environment variable');
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    strict: true,
    deprecationErrors: true,
    version: ServerApiVersion.v1,
  },
});

export default async (_: Request, context: Context) => {
  const {slug} = context.params;

  if (!slug) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Missing slug'}),
    };
  }

  try {
    await client.connect();
    const database = client.db('LaborForZion');
    const collection = database.collection('hits');

    // increment the hits by 1
    await collection.updateOne(
      {slug},
      {$inc: {hits: 1}},
      {upsert: true}
    );

    // Read the updated hits
    const updatedDoc = await collection.findOne({ slug });
    const count = updatedDoc ? updatedDoc.hits : 0;

    // Return total hits
    return {
      statusCode: 200,
      body: JSON.stringify({ count }),
    };

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({message: 'Internal server error'}),
    };
  } finally {
    await client.close();
  }

};

export const config: Config = {
  path: '/posts/:slug',
};
