const mongoose = require("mongoose");

async function checkClasses() {
  const uri =
    "mongodb+srv://adsrahmed_db_user:XhsFvZtpyW2v8uAU@cluster0.xtzhsdn.mongodb.net/gympro";
  await mongoose.connect(uri);
  const GymClass = mongoose.model(
    "GymClass",
    new mongoose.Schema({}, { strict: false }),
    "gymclasses",
  );
  const classes = await GymClass.find({}).lean();
  console.log("Total Classes:", classes.length);
  classes.forEach((c, i) => {
    console.log(
      `Class ${i}: name=${c.name}, coachId=${c.coachId}, coachIdType=${typeof c.coachId} (${c.coachId instanceof mongoose.Types.ObjectId ? "ObjectId" : "String"})`,
    );
  });
  process.exit(0);
}

checkClasses().catch((err) => {
  console.error(err);
  process.exit(1);
});
