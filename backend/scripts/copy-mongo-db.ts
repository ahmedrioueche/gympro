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

function resolveTargetDbName(): string {
  const fromArg = process.argv[2]?.trim();
  if (fromArg) {
    return fromArg;
  }
  const fromEnv = process.env.COPY_TARGET_DB?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  return PROD_MONGO_DB_NAME;
}

function resolveSourceDbName(): string {
  return process.env.COPY_SOURCE_DB?.trim() || DEV_MONGO_DB_NAME;
}

async function main() {
  const sourceDbName = resolveSourceDbName();
  const targetDbName = resolveTargetDbName();

  if (process.env.COPY_DB_CONFIRM !== 'yes') {
    console.error(
      `Refusing to run without COPY_DB_CONFIRM=yes (copies ${sourceDbName} → ${targetDbName}).`,
    );
    console.error(
      'Example: COPY_DB_CONFIRM=yes npm run db:copy-test-to-dev',
    );
    process.exit(1);
  }

  const uri = resolveMongoUri();
  const client = new MongoClient(uri);

  console.log(`Source: ${sourceDbName}`);
  console.log(`Target: ${targetDbName}`);
  console.log(`Cluster: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

  try {
    await client.connect();
    const sourceDb = client.db(sourceDbName);
    const targetDb = client.db(targetDbName);

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

    console.log(
      `\nDone. ${totalDocs} documents copied to ${targetDbName}.`,
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('Copy failed:', error);
  process.exit(1);
});
