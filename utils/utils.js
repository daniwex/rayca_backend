const handleError = (res, status, message, error) => {
   res.status(status).json({ message, error });
  };

const handleMissingFields = (res,status) => {
    res.status(status).send("please fill in your email and password")
}
  module.exports = {handleError, handleMissingFields}