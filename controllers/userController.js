const { User, Thought } = require("../models");
const {
  handleServerError,
  handleNotFoundError,
  handleSuccess,
} = require("../utils/helpers");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      let users = await User.find();
      handleSuccess(res, users);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      let user = await User.findOne({ _id: req.params.userId }).select("-__v");

      if (!user) {
        handleNotFoundError(res, "No user with that ID");
        return;
      }

      handleSuccess(res, user);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      let user = await User.create(req.body);
      handleSuccess(res, user);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      let user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user id found!" });
      }

      handleSuccess(res, user);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Delete a user and associated thoughts
  async deleteUser(req, res) {
    try {
      let user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        handleNotFoundError(res, "No user with that ID");
        return;
      }

      if (user.thoughts && user.thoughts.length > 0) {
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
      }

      return res.status(200).json({
        message: "User and associated thoughts deleted!",
        deletedUser: user,
      });
    } catch (err) {
      handleServerError(err, res);
    }
  },
};
