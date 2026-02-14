const mongoose = require('mongoose');
const { Types } = mongoose;
require('dotenv').config();

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI);

  const userId = '698fa6635074001c145e7d0c';
  console.log(`Checking user: ${userId}`);

  const Membership = mongoose.connection.collection('gym_memberships');
  const Gym = mongoose.connection.collection('gyms');
  const User = mongoose.connection.collection('users');

  const userMembership = await Membership.findOne({
    user: new Types.ObjectId(userId),
  });
  if (!userMembership) {
    console.log('User has no membership');
    process.exit(0);
  }

  console.log('User Membership:', JSON.stringify(userMembership, null, 2));

  const gymId = userMembership.gym;
  console.log(
    `Gym ID: ${gymId} (Type: ${typeof gymId}, InstanceOf: ${gymId.constructor.name})`,
  );

  const gym = await Gym.findOne({ _id: gymId });
  console.log('Gym found:', !!gym);
  if (gym) {
    console.log('Gym Name:', gym.name);
    console.log('Gym Owner (from Gym model):', gym.owner);
  }

  const allMemberships = await Membership.find({ gym: gymId }).toArray();
  console.log(`Total memberships found for this gym: ${allMemberships.length}`);

  for (const m of allMemberships) {
    console.log(
      `- User: ${m.user}, Status: ${m.membershipStatus}, Roles: ${JSON.stringify(m.roles)} (Type: ${typeof m.roles})`,
    );
  }

  // Simulate the new logic
  const usersMap = new Map();
  if (gym.owner) {
    const ownerUser = await User.findOne({ _id: gym.owner });
    if (ownerUser) {
      usersMap.set(ownerUser._id.toString(), ownerUser);
    }
  }

  const managersFromMembership = allMemberships.filter(
    (m) =>
      m.membershipStatus === 'active' &&
      m.roles &&
      Array.isArray(m.roles) &&
      (m.roles.includes('owner') || m.roles.includes('manager')),
  );

  console.log(
    `Managers from membership filtering: ${managersFromMembership.length}`,
  );
  for (const m of managersFromMembership) {
    const u = await User.findOne({ _id: m.user });
    console.log(`- Found manager user: ${m.user}, user object: ${!!u}`);
    if (u) {
      usersMap.set(u._id.toString(), u);
    }
  }

  console.log(
    `Found ${usersMap.size} unique users to notify (Owner + Managers):`,
  );
  for (const [id, u] of usersMap) {
    console.log(
      `- To Notify: ${id} (${u?.profile?.fullName || u?.profile?.username})`,
    );
  }

  await mongoose.disconnect();
}

debug().catch(console.error);
