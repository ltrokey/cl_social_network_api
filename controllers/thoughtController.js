const { Thought, Reaction, User } = require("../models");
const {
  handleServerError,
  handleNotFoundError,
  handleSuccess,
} = require("../utils/helpers");

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      let thoughts = await Thought.find();
      handleSuccess(res, thoughts);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Get a single thought
  async getSingleThought(req, res) {
    try {
      let thought = await Thought.findOne({ _id: req.params.thoughtId });

      console.log("thoughtID", req.params);

      if (!thought) {
        handleNotFoundError(res, "No thought with that ID");
        return;
      }

      handleSuccess(res, thought);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      let thought = await Thought.create(req.body);
      let user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "Thought created, but no user found with that ID",
        });
      }
      handleSuccess(res, thought);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Update thought
  async updateThought(req, res) {
    try {
      let thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought id found!" });
      }

      handleSuccess(res, thought);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Delete a thought and associated reactions
  async deleteThought(req, res) {
    try {
      let thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        handleNotFoundError(res, "No thought with that ID");
        return;
      }

      if (thought.reactions && thought.reactions.length > 0) {
        await Reaction.deleteMany({ _id: { $in: thought.reactions } });
      }

      return res.status(200).json({
        message: "Thought and associated reactions deleted!",
        deletedThought: thought,
      });
    } catch (err) {
      handleServerError(err, res);
    }
  },
};
