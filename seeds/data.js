const { User } = require("../models");

const usernames = [
  "StellarExplorer",
  "QuantumJazz",
  "LunarPhoenix",
  "MysticPenguin",
  "NebulaWhisper",
  "CyberBlossom",
  "RadiantGrove",
  "CelestialRaptor",
  "PixelVortex",
  "ZenithPioneer",
  "EchoSphinx",
  "SolarFalcon",
  "CosmicCascade",
  "NimbusJester",
  "GalacticHarmony",
  "PonderingPixel",
  "EtherealBard",
  "InfinityCrafter",
  "AuroraMystique",
  "QuantumSculptor",
];

const emails = [
  "cosmic.explorer@example.com",
  "dreamy.wanderer@example.com",
  "quantum.traveler@example.com",
  "radiant.sunshine@example.com",
  "mystic.enigma@example.com",
  "stellar.quest@example.com",
  "ethereal.nomad@example.com",
  "celestial.dreamer@example.com",
  "galactic.roamer@example.com",
  "luminous.adventurer@example.com",
  "infinite.seeker@example.com",
  "nebula.wisdom@example.com",
  "cosmic.spectacle@example.com",
  "radiant.echo@example.com",
  "starry.nomad@example.com",
  "lunar.voyager@example.com",
  "astral.journey@example.com",
  "quantum.quest@example.com",
  "ethereal.odyssey@example.com",
  "celestial.traverse@example.com",
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
  "Whispered secrets of the moonlight reveal mysteries.",
  "Journey through the cosmos of imagination.",
  "Lost in the pages of a story untold.",
  "Embers of hope glow brightest in the dark.",
  "Wandering through the tapestry of memories.",
  "In the symphony of life, find your melody.",
  "Sunsets are a canvas painted with dreams.",
  "Beyond the horizon lies the magic of tomorrow.",
  "Raindrops carry the songs of forgotten wishes.",
  "Time dances in the footsteps of fleeting moments.",
  "Stars are the storytellers of the night sky.",
  "Echoes of laughter resonate through time.",
  "The heart whispers secrets only the soul can hear.",
  "Blossoms unfold, revealing the poetry of nature.",
  "Reflections in still waters reveal hidden depths.",
  "Between the lines, discover the art of silence.",
  "Every journey begins with a single, courageous step.",
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
  "Life's symphony is where we find our shared melody.",
  "Sunsets are nature's universally admired masterpieces.",
  "The promise of tomorrow is a horizon for everyone.",
  "Raindrops carry wishes that connect us all.",
  "Fleeting moments, embraced by the dance of time.",
  "Stars tell timeless tales in the night sky.",
  "Echoes of laughter bridge across generations.",
  "The soul's secrets connect us on a profound level.",
  "Nature's poetry unfolds universally in blossoms.",
  "Hidden depths are revealed in the stillness we share.",
  "The art of silence speaks universally.",
  "Courageous steps inspire extraordinary journeys for all.",
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
      const numFriends = Math.floor(Math.random() * allUsers.length);

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

const assignThoughts = () => {
  const thoughts = thoughtTexts.map((thoughtText) => {
    const randomIndex = Math.floor(Math.random() * usernames.length);
    const username = usernames[randomIndex];

    const numReactions = Math.floor(
      Math.random() * (reactionBodies.length + 1)
    );
    const reactions = [];

    for (let i = 0; i < numReactions; i++) {
      const randomUsername =
        usernames[Math.floor(Math.random() * usernames.length)];
      const reactionBody =
        reactionBodies[Math.floor(Math.random() * reactionBodies.length)];
      reactions.push({ username: randomUsername, reactionBody });
    }

    return { username, thought: thoughtText, reactions };
  });

  return thoughts;
};

module.exports = { assignUsers, assignThoughts, addFriends };
