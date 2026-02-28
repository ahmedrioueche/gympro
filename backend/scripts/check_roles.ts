import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function checkRoles() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    const memberships = await db
      .collection('gym_memberships')
      .find({})
      .toArray();
    console.log(`Found ${memberships.length} memberships globally`);

    const rolesCount: Record<string, number> = {};
    for (const m of memberships) {
      const roles = m.roles || [];
      for (const r of roles) {
        rolesCount[r] = (rolesCount[r] || 0) + 1;
      }
    }
    console.log('Roles distribution:', rolesCount);
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await client.close();
  }
}

checkRoles();
