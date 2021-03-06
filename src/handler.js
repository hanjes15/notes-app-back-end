const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  try {
    const {
      name, year, author, summary, publisher, pageCount,
      readPage, reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    // check
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
      // check
    } if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih  besar dar pageCount',
      });
      response.code(400);
      return response;
      // check
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    books.push(newBook);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  // check
  const { name, reading, finished } = request.query;
  if (name) {
    const byName = books.filter((x) => x.name.toLowerCase() === name.toLowerCase());
    const response = h.response({
      status: 'success',
      data: {
        books: byName.map((y) => ({
          id: y.id,
          name: y.name,
          publisher: y.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (reading) {
    const byReading = books.filter((x) => Number(x.reading) === Number(reading));
    const response = h.response({
      status: 'success',
      data: {
        books: byReading.map((y) => ({
          id: y.id,
          name: y.name,
          publisher: y.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (finished) {
    const byFinished = books.filter((x) => Number(x.finished) === Number(finished));
    const response = h.response({
      status: 'success',
      data: {
        books: byFinished.map((y) => ({
          id: y.id,
          name: y.name,
          publisher: y.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  if (books[0] !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
  // check
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];
  // check
  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  // check
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const newLocal = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  // check
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  // check
  if (newLocal.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // check
  if (newLocal.readPage > newLocal.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // check
  books[index] = {
    ...books[index],
    ...newLocal,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((note) => note.id === bookId);
  // check
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // check
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
