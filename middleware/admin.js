const {handleError} = require("../utils/utils")

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return handleError(
      res,
      403,
      "You are not authorized to perform this action"
    );
  }
  next();
};


module.exports = isAdmin