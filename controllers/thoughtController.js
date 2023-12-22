const { Thought, Reaction } = require("../models");
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
      let thought = await Thought.findOne({ _id: req.params.thoughtId }).select(
        "-__v"
      );

      if (!thought) {
        handleNotFoundError(res, "No thought with that ID");
        return;
      }

      handleSuccess(res, thought);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Create a new user
  async createThought(req, res) {
    try {
      let thought = await Thought.create(req.body);
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

  // Delete a thought and associated apps
  async deleteThought(req, res) {
    try {
      let thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        handleNotFoundError(res, "No thought with that ID");
        return;
      }

      await Reaction.deleteMany({ _id: { $in: thought.reactions } });
      return res.status(200).json({
        message: "Thought and associated reactions deleted!",
        deletedThought: thought,
      });
    } catch (err) {
      handleServerError(err, res);
    }
  },
};
