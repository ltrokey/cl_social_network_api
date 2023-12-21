const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { assignUsers, assignThoughts } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("Connected to the database.");

  let userCheck = await connection.db
    .listCollections({ name: "users" })
    .toArray();
  if (userCheck.length) {
    await connection.dropCollection("users");
  }

  const { usernames, emails } = require("./data");
  const thoughtTexts = require("./data").thoughtTexts;

  const users = assignUsers(usernames, emails);
  const thoughts = assignThoughts(usernames, thoughtTexts);

  await User.collection.insertMany(users);
  await Thought.collection.insertMany(thoughts);

  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete!");
  process.exit(0);
});
