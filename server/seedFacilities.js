// seedFacilities.js
const mongoose = require("mongoose");
const Facility = require("./models/Facility");

MONGO_URI =
  "mongodb+srv://akshavanthvm:FYJrR7Dk40se10SZ@cluster0.bubdbyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const facilities = [
  { name: "unit1", type: "direct_use" },
  { name: "unit2", type: "direct_use" },
  { name: "ravi cold", type: "cold_storage" },
  { name: "senthil cold", type: "cold_storage" },
  { name: "krishna cold", type: "cold_storage" },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Facility.deleteMany(); // optional: wipe previous entries
    await Facility.insertMany(facilities);
    console.log("✅ Facilities seeded!");
  } catch (err) {
    console.error("❌ Error seeding facilities:", err);
  } finally {
    mongoose.connection.close();
  }
};

seed();
