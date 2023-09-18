;

const { nanoid } = require("nanoid");

function generateId() {
  return nanoid();
}

module.exports = { generateId };
