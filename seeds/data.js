const { User, Thought } = require("../models");

const usernames = [
  "StellarExplorer",
  "QuantumJazz",
  "LunarPhoenix",
  "MysticPenguin",
  "NebulaWhisper",
];

const emails = [
  "cosmic.explorer@example.com",
  "dreamy.wanderer@example.com",
  "quantum.traveler@example.com",
  "radiant.sunshine@example.com",
  "mystic.enigma@example.com",
];

const thoughtTexts = [
  "Embrace the unknown and discover new horizons.",
  "A single spark can ignite the flame of innovation.",
  "Lost in the melody of a thousand whispered dreams.",
  "Savoring the silence, where words become echoes.",
  "In the dance of chaos, find your rhythm.",
  "Echoes of laughter linger in the twilight.",
  "Serenity found in the gentle embrace of nature.",
  "Illuminate the world with your unique brilliance.",
  "Dreams are whispers of the soul's desires.",
  "Beneath the stars, stories of the universe unfold.",
  "A single thought can change the course of galaxies.",
  "Seek solace in the embrace of quiet moments.",
  "Navigating life's labyrinth, one step at a time.",
];

const reactionBodies = [
  "I resonate with the essence of your words.",
  "Your thoughts are truly inspiring.",
  "A profound reflection, beautifully expressed.",
  "Captivating perspective on life's dance.",
  "Your words create a harmonious rhythm.",
  "Laughter's echoes are universally comforting.",
  "Nature's embrace is a source of solace.",
  "Your brilliance shines through your words.",
  "Dreams are indeed universal aspirations.",
  "Stories of the universe captivate the mind.",
  "A single thought can change one's perspective.",
  "Finding solace in quiet moments is wisdom.",
  "Navigating life's labyrinth is a shared journey.",
  "Moonlight's mysteries are universally enchanting.",
  "Journeying through imagination is magical for all.",
  "Lost in a story's pages, an escape we all cherish.",
  "Embers of hope resonate universally.",
  "Memories weave the tapestry of human experience.",
];

const assignUsers = () => {
  if (usernames.length !== emails.length) {
    console.error("Number of usernames and emails must be equal.");
    return [];
  }

  const users = usernames.map((username, index) => {
    const email = emails[index];
    const thoughts = [];
    const friends = [];

    return { username, email, thoughts, friends };
  });

  return users;
};

const addFriends = async () => {
  try {
    const allUsers = await User.find();

    allUsers.forEach((user) => {
      const numFriends = Math.floor(Math.random() * 3);

      for (let i = 0; i < numFriends; i++) {
        let randomUser;

        do {
          randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
        } while (randomUser._id.toString() === user._id.toString());

        user.friends.push(randomUser._id);
      }
    });

    await Promise.all(allUsers.map((user) => user.save()));

    return { friends: allUsers.map((user) => user._id) };
  } catch (error) {
    console.error("Error adding friends:", error);
    throw error;
  }
};

const createThoughts = () => {
  const thoughts = thoughtTexts.map((thoughtText) => {
    const randomIndex = Math.floor(Math.random() * usernames.length);
    const username = usernames[randomIndex];

    const numReactions = Math.floor(Math.random() * 5);
    const reactions = [];

    for (let i = 0; i < numReactions; i++) {
      const randomUsername =
        usernames[Math.floor(Math.random() * usernames.length)];
      const reactionBody =
        reactionBodies[Math.floor(Math.random() * reactionBodies.length)];
      reactions.push({ username: randomUsername, reactionBody });
    }

    return { username, thoughtText, reactions };
  });

  return thoughts;
};

const assignThoughtId = async () => {
  try {
    const allUsers = await User.find();
    const allThoughts = await Thought.find();

    for (const thought of allThoughts) {
      const user = allUsers.find((user) => user.username === thought.username);

      if (user) {
        user.thoughts.push(thought._id);
        await user.save();
      } else {
        console.error(`User not found for thought: ${thought}`);
      }
    }

    return allUsers;
  } catch (error) {
    console.error("Error assigning thoughts:", error);
    throw error;
  }
};

module.exports = { assignUsers, createThoughts, addFriends, assignThoughtId };
