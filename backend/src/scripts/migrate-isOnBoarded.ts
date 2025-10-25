import { MongoClient } from 'mongodb';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/gympro';

async function migrateIsOnBoarded() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Find users that don't have the isOnBoarded field
    const usersWithoutIsOnBoarded = await usersCollection
      .find({
        isOnBoarded: { $exists: false },
      })
      .toArray();

    console.log(
      `Found ${usersWithoutIsOnBoarded.length} users without isOnBoarded field`,
    );

    if (usersWithoutIsOnBoarded.length > 0) {
      // Update all users without isOnBoarded field to set it to false
      const result = await usersCollection.updateMany(
        { isOnBoarded: { $exists: false } },
        { $set: { isOnBoarded: false } },
      );

      console.log(
        `Updated ${result.modifiedCount} users with isOnBoarded: false`,
      );
    } else {
      console.log('All users already have the isOnBoarded field');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  migrateIsOnBoarded()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateIsOnBoarded };
