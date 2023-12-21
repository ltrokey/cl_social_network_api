const mongoose = require("mongoose");
const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { assignUsers, assignThoughts } = require("./data");

connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

connection.once("open", async () => {
  console.log("Connected to the database.");

  let thoughtCheck = await mongoose.connection.db
    .listCollections({ name: "thoughts" })
    .toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection("thoughts");
  }

  let userCheck = await mongoose.connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (userCheck.length) {
    await connection.dropCollection("users");
  }

  const users = assignUsers();
  const thoughts = assignThoughts();

  await User.collection.insertMany(users);
  await Thought.collection.insertMany(thoughts);

  try {
    console.table(users);
    console.table(thoughts);
    console.info("Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    process.exit(0);
  }
});
