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
        handleNotFoundError(res, "No user with that ID");
        return;
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
      handleSuccess(res, "User and associated thoughts deleted!", user);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Add Friend
  async addFriend(req, res) {
    try {
      let user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body } },
        { runValidators: true, new: true }
      );
      if (!user) {
        handleNotFoundError(res, "No user with that ID");
        return;
      }
      handleSuccess(res, "Friend successfully added", user);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Delete Friend
  async removeFriend(req, res) {
    try {
      let user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        handleNotFoundError(res, "No user with that ID");
        return;
      }
      handleSuccess(res, "Friend successfully removed", user);
    } catch (err) {
      handleServerError(err, res);
    }
  },
};
