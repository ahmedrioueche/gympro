import { Db, MongoClient } from 'mongodb';
import { getMongoClientOptions } from '../config/mongo.config';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const mongoProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: async (): Promise<Db> => {
    const { uri, dbName } = getMongoClientOptions();
    const client = new MongoClient(uri);
    await client.connect();
    return client.db(dbName);
  },
};
