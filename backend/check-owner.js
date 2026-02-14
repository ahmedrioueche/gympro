const mongoose = require('mongoose');
const { Types } = mongoose;
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Gym = mongoose.connection.collection('gyms');
  const userId = '698fa6635074001c145e7d0c';
  const Membership = mongoose.connection.collection('gym_memberships');

  const m = await Membership.findOne({ user: new Types.ObjectId(userId) });
  if (!m) {
    console.log('No membership');
    process.exit(0);
  }

  const gym = await Gym.findOne({ _id: m.gym });
  console.log('Gym ID:', m.gym);
  console.log('Gym Owner ID:', gym.owner);

  const owner = await mongoose.connection
    .collection('users')
    .findOne({ _id: gym.owner });
  console.log('Owner Full Name:', owner?.profile?.fullName);

  await mongoose.disconnect();
}
run().catch(console.error);
