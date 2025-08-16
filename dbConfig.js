import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://abdulbari9221603:kHpz44CraeL1OHtA@cluster0.ek6tezf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});