/** eslint-disable max-classes-per-file */
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message || "Internal server error!");
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

class ValidationError extends ApiError {
  constructor(message) {
    super(message || "Validation error!", 400);
    this.name = "ValidationError";
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message || "Not found!", 404);
    this.name = "NotFoundError";
  }
}

function handleError(h, err) {
  if (err instanceof ApiError) {
    return h
      .response({
        status: "fail",
        message: err.message,
      })
      .code(err.statusCode);
  }
  console.log(err);
  return h
    .response({
      status: "fail",
      message: "Something wrong!",
    })
    .code(500);
}

module.exports = {
  ApiError,
  ValidationError,
  NotFoundError,
  handleError,
};
