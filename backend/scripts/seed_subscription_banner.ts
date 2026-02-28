import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gympro';

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    // Atlas URIs trailing with / default to test usually, but check if there's a specific DB
    const db = client.db();
    console.log(`Connected to database: ${db.databaseName}`);

    const collection = db.collection('systemalerts');

    const warningBanner = {
      translations: {
        en: 'Your subscription is expiring soon. Please renew to avoid service interruption.',
        fr: 'Votre abonnement expire bientôt. Veuillez le renouveler pour éviter toute interruption de service.',
        ar: 'اشتراكك على وشك الانتهاء. يرجى التجديد لتجنب انقطاع الخدمة.',
      },
      variant: 'error',
      action: { type: 'modal', payload: 'subscription_warning' }, // Link to billing page
      color: '', // Use standard error color
      isRemovable: false,
      frequencyHours: 0,
      isActive: true,
      templateKey: 'SUBSCRIPTION_WARNING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if it already exists
    const existing = await collection.findOne({
      templateKey: 'SUBSCRIPTION_WARNING',
    });
    if (existing) {
      console.log('Subscription warning banner already exists. Updating...');
      await collection.updateOne(
        { _id: existing._id },
        { $set: warningBanner },
      );
      console.log('Updated successfully.');
    } else {
      console.log('Creating new subscription warning banner...');
      await collection.insertOne(warningBanner);
      console.log('Created successfully.');
    }
  } catch (error) {
    console.error('Error seeding banner:', error);
  } finally {
    await client.close();
  }
}

seed();
