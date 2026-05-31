import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import * as path from 'path';
import {
  DEV_MONGO_DB_NAME,
  PROD_MONGO_DB_NAME,
  resolveMongoUri,
} from '../src/common/config/mongo.config';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BATCH_SIZE = 500;

async function copyCollection(
  sourceDb: ReturnType<MongoClient['db']>,
  targetDb: ReturnType<MongoClient['db']>,
  collectionName: string,
): Promise<number> {
  const source = sourceDb.collection(collectionName);
  const target = targetDb.collection(collectionName);
  const total = await source.countDocuments();

  if (total === 0) {
    console.log(`  ${collectionName}: empty, skipped`);
    return 0;
  }

  await target.deleteMany({});

  let copied = 0;
  const cursor = source.find({}).batchSize(BATCH_SIZE);

  while (await cursor.hasNext()) {
    const batch: Record<string, unknown>[] = [];
    for (let i = 0; i < BATCH_SIZE && (await cursor.hasNext()); i++) {
      batch.push((await cursor.next()) as Record<string, unknown>);
    }
    if (batch.length > 0) {
      await target.insertMany(batch, { ordered: false });
      copied += batch.length;
    }
  }

  console.log(`  ${collectionName}: copied ${copied}/${total} documents`);
  return copied;
}

async function main() {
  if (process.env.COPY_DB_CONFIRM !== 'yes') {
    console.error(
      'Refusing to run without COPY_DB_CONFIRM=yes (copies test → gympro-prod).',
    );
    console.error(
      'Example: COPY_DB_CONFIRM=yes npm run db:copy-test-to-prod',
    );
    process.exit(1);
  }

  const uri = resolveMongoUri();
  const client = new MongoClient(uri);

  console.log(`Source: ${DEV_MONGO_DB_NAME}`);
  console.log(`Target: ${PROD_MONGO_DB_NAME}`);
  console.log(`Cluster: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

  try {
    await client.connect();
    const sourceDb = client.db(DEV_MONGO_DB_NAME);
    const targetDb = client.db(PROD_MONGO_DB_NAME);

    const collections = await sourceDb.listCollections().toArray();
    const names = collections
      .map((c) => c.name)
      .filter((name) => !name.startsWith('system.'));

    if (names.length === 0) {
      console.log('No collections found in source database.');
      return;
    }

    console.log(`Copying ${names.length} collections...\n`);

    let totalDocs = 0;
    for (const name of names) {
      totalDocs += await copyCollection(sourceDb, targetDb, name);
    }

    console.log(`\nDone. ${totalDocs} documents copied to ${PROD_MONGO_DB_NAME}.`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('Copy failed:', error);
  process.exit(1);
});
