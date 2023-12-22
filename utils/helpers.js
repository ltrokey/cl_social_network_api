const handleServerError = (err, res) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
};

const handleNotFoundError = (res, message) => {
  res.status(404).json({ success: false, error: message || "Not Found" });
};

const handleSuccess = (res, data) => {
  res.json({ success: true, data });
};

module.exports = {
  handleServerError,
  handleNotFoundError,
  handleSuccess,
};
