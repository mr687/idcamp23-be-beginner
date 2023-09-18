const cloneDeep = require("lodash/cloneDeep");
const LocallyDB = require("locallydb");

const db = new LocallyDB("./bookshelf-db");

const bookModel = db.collection("books");
bookModel.toDto = (data) => {
  if (data === undefined || data === null) return undefined;
  const toDto = (item) => {
    const result = cloneDeep(item);
    if ("cid" in result) delete result.cid;
    if ("$created" in result) {
      result.insertedAt = result.$created;
      delete result.$created;
    }
    if ("$updated" in result) {
      result.updatedAt = result.$updated;
      delete result.$updated;
    }
    return result;
  };
  if (Array.isArray(data)) {
    return data.map(toDto);
  }
  if (typeof data === "object") {
    return toDto(data);
  }
  return data;
};

module.exports = {
  db,
  bookModel,
};
