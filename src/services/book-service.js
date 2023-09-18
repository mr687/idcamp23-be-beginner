const escapeRegExp = require("lodash/escapeRegExp");
const map = require("lodash/map");
const isNil = require("lodash/isNil");

const { NotFoundError, ValidationError } = require("../shared/error");
const { bookModel } = require("../shared/db");
const { generateId } = require("../shared/generate-id");

async function getBooks({ name, reading, finished }) {
  let books = bookModel.items;

  // Filter books
  if (!isNil(name)) {
    const nameRegexp = new RegExp(escapeRegExp(name), "i");
    books = books.filter((book) => nameRegexp.test(book.name));
  }

  if (!isNil(reading)) {
    books = books.filter((book) => book.reading === Boolean(reading));
  }

  if (!isNil(finished)) {
    books = books.filter((book) => book.finished === Boolean(finished));
  }

  return map(books, (book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
}

async function getBook(id) {
  const books = bookModel.where({ id });
  if (!books.length()) throw new NotFoundError("Buku tidak ditemukan");
  return bookModel.toDto(books.shift());
}

async function insertBook(data) {
  if (!data.name) {
    throw new ValidationError("Gagal menambahkan buku. Mohon isi nama buku");
  }

  if (data.readPage > data.pageCount) {
    throw new ValidationError(
      "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    );
  }

  data.id = generateId();
  data.finished = data.pageCount === data.readPage;
  bookModel.insert(data);
  return data.id;
}

async function updateBook(id, data) {
  if (!data.name) {
    throw new ValidationError("Gagal memperbarui buku. Mohon isi nama buku");
  }

  if (data.readPage > data.pageCount) {
    throw new ValidationError(
      "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    );
  }

  const books = bookModel.where({ id });
  if (!books.length()) throw new NotFoundError("Gagal memperbarui buku. Id tidak ditemukan");
  const book = books.shift();

  data.finished = data.pageCount === data.readPage;
  bookModel.update(book.cid, data);
}

async function deleteBook(id) {
  const books = bookModel.where({ id });
  if (!books.length()) throw new NotFoundError("Buku gagal dihapus. Id tidak ditemukan");
  const book = books.shift();
  bookModel.remove(book.cid);
}

module.exports = {
  getBooks,
  getBook,
  insertBook,
  updateBook,
  deleteBook,
};
