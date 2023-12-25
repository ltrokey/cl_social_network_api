const mongoose = require("mongoose");
const connection = require("../config/connection");
const { User, Thought } = require("../models");
const {
  assignUsers,
  createThoughts,
  addFriends,
  assignThoughtId,
} = require("./data");

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
  const thoughts = createThoughts();
  await User.collection.insertMany(users);
  await Thought.collection.insertMany(thoughts);

  const userFriends = await addFriends();
  const userIds = userFriends.friends;

  await User.collection.updateMany(
    { _id: { $in: userIds } },
    { $push: { friends: { $each: userIds } } }
  );

  const assignedUsers = await assignThoughtId();
  const userThoughtIds = assignedUsers.flatMap((user) => user.thoughts);

  await User.collection.updateMany(
    { _id: { $in: assignedUsers.map((user) => user._id) } },
    {
      $push: {
        thoughts: { $each: userThoughtIds },
      },
    }
  );

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
