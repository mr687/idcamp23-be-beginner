const Joi = require("joi");

const bookService = require("../services/book-service");
const { handleError } = require("../shared/error");

/**
 * Initialize Book routes
 *
 * @param {import('@hapi/hapi').Server} server
 */
function createBookRoutes(server) {
  // GET - Books
  server.route({
    method: "GET",
    path: "/books",
    async handler(req) {
      const params = req.query || {};
      const data = await bookService.getBooks(params);
      return {
        status: "success",
        data: {
          books: data,
        },
      };
    },
    options: {
      validate: {
        query: Joi.object({
          name: Joi.string().min(1).optional(),
          reading: Joi.number().valid(0, 1).optional(),
          finished: Joi.number().valid(0, 1).optional(),
        }).optional(),
      },
    },
  });

  // GET - Book by ID
  server.route({
    method: "GET",
    path: "/books/{bookId}",
    async handler(req, h) {
      try {
        const { bookId } = req.params;
        const book = await bookService.getBook(bookId);
        return {
          status: "success",
          data: {
            book,
          },
        };
      } catch (error) {
        return handleError(h, error);
      }
    },
  });

  // POST - Insert Book
  server.route({
    method: "POST",
    path: "/books",
    async handler(req, h) {
      try {
        const { payload } = req;
        const newBookId = await bookService.insertBook(payload);
        return h
          .response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
              bookId: newBookId,
            },
          })
          .code(201);
      } catch (error) {
        return handleError(h, error);
      }
    },
  });

  // PUT - Update Book by ID
  server.route({
    method: "PUT",
    path: "/books/{bookId}",
    async handler(req, h) {
      try {
        const { bookId } = req.params;
        const { payload } = req;
        await bookService.updateBook(bookId, payload);
        return {
          status: "success",
          message: "Buku berhasil diperbarui",
        };
      } catch (error) {
        return handleError(h, error);
      }
    },
  });

  // DELETE - Delete Book by ID
  server.route({
    method: "DELETE",
    path: "/books/{bookId}",
    async handler(req, h) {
      try {
        const { bookId } = req.params;
        await bookService.deleteBook(bookId);
        return {
          status: "success",
          message: "Buku berhasil dihapus",
        };
      } catch (error) {
        return handleError(h, error);
      }
    },
  });
}

module.exports = createBookRoutes;
