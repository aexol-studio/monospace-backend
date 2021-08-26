import { MongoClient, Db } from 'mongodb';

const aClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
let mongoConnection: { db: Db; client: MongoClient } | undefined = undefined;

export const mc = () => {
  if (mongoConnection) {
    return Promise.resolve(mongoConnection);
  }
  if (!process.env.MONGO_URL) {
    throw new Error('Please provide database url in your environment settings');
  }
  return aClient.connect().then((client) => ({ client, db: client.db() }));
};
