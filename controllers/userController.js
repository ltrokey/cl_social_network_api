const { User } = require("../models");
const {
  handleServerError,
  handleNotFoundError,
  handleSuccess,
} = require("../utils/helpers");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      handleSuccess(res, users);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
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

  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      handleSuccess(res, user);
    } catch (err) {
      handleServerError(err, res);
    }
  },

  // Delete a user and associated apps
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        handleNotFoundError(res, "No user with that ID");
        return;
      }

      await Application.deleteMany({ _id: { $in: user.thoughts } });
      handleSuccess(res, { message: "User and associated apps deleted!" });
    } catch (err) {
      handleServerError(err, res);
    }
  },
};
