import * as dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Fixed path to ../.env

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function testMembers() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log(
      'Connected to database at',
      uri.replace(/:([^:@]{1,})@/, ':***@'),
    );
    const db = client.db();

    const gyms = await db.collection('gymmodels').find({}).toArray();
    console.log(`Found ${gyms.length} gyms globally`);

    for (const gym of gyms) {
      console.log(`\nGym: ${gym.name} | ID: ${gym._id}`);
      const memberships = await db
        .collection('gym_memberships')
        .find({
          gym: new ObjectId(gym._id),
        })
        .toArray();
      // Notice: collection is 'gym_memberships'

      console.log(
        `Found ${memberships.length} memberships containing gym Reference`,
      );

      if (memberships.length > 0) {
        console.log(
          'First membership gym type:',
          typeof memberships[0].gym,
          memberships[0].gym,
          memberships[0].roles,
        );
      }

      // Let's get the users
      const memberQuery = await db
        .collection('users')
        .find({
          memberships: { $in: memberships.map((m) => m._id) },
        })
        .limit(5)
        .toArray();

      console.log(
        `Users populated containing these memberships: ${memberQuery.length}`,
      );
    }
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await client.close();
  }
}

testMembers();
