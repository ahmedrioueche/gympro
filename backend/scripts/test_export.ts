import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gympro';

async function testExport() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to database');
    const db = client.db('gympro'); // Assuming default db, you may adjust if it uses a different name

    // Find a user who is an owner
    const gym = await db.collection('gymmodels').findOne({});
    if (!gym) {
      console.log('No gyms found');
      return;
    }
    const ownerId = gym.owner;
    console.log('Testing with Owner ID:', ownerId.toString());

    // 1. Fetch gyms by owner
    const gyms = await db
      .collection('gymmodels')
      .find({ owner: ownerId })
      .toArray();
    console.log(`Found ${gyms.length} gyms`);

    for (const bgym of gyms) {
      console.log('Processing Gym:', bgym.name, bgym._id.toString());
      // simulate getGymMembers
      const memberships = await db
        .collection('memberships')
        .find({
          gym: bgym._id,
          membershipStatus: { $in: ['active', 'pending', 'expired', 'banned'] },
          roles: 'member',
        })
        .toArray();

      console.log(
        `Found ${memberships.length} memberships for gym ${bgym.name}`,
      );
    }
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await client.close();
  }
}

testExport();
