import mongoose from "mongoose";
import User from "../src/models/User.js";

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jewellry";
    await mongoose.connect(mongoUri);

    const email = "admin@example.com";
    const password = "adminpassword123";

    let admin = await User.findOne({ email });

    if (!admin) {
      admin = new User({
        name: "Admin User",
        email,
        password,
        role: "admin",
      });
      await admin.save();
      console.log("Admin user created successfully.");
    } else {
      admin.password = password;
      admin.role = "admin";
      await admin.save();
      console.log("Admin user already existed, password and role reset.");
    }

    console.log("----------------------------------");
    console.log("Admin Email:", email);
    console.log("Admin Password:", password);
    console.log("----------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
