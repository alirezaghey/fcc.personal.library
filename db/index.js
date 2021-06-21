const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env["MONGO_URI"], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));

const bookSchema = new mongoose.Schema(
  {
    title: { type: String },
    comments: [String],
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

const Book = mongoose.model("Book", bookSchema);

const createBook = (Booktitle, done) => {
  bookDoc = new Book({ title: Booktitle });
  bookDoc.save((err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const getAllBooks = (done) => {
  Book.find((err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const findBookById = (id, done) => {
  Book.findById(id, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const createComment = (bookId, comment, done) => {
  Book.findById(bookId, (err, book) => {
    if (err) return done(err);
    if (!book) return done(null, book);
    book.comments.push(comment);
    book.save((err, data) => {
      if (err) return done(err);
      return done(null, data);
    });
  });
};

const deleteBook = (bookId, done) => {
  Book.findByIdAndRemove(bookId, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const deleteAllBooks = (done) => {
  Book.deleteMany((err) => {
    if (err) return done(err);
    return done(null, true);
  });
};

const findBookByTitle = (title, done) => {
  Book.findOne({ title }, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

module.exports = {
  deleteAllBooks,
  deleteBook,
  createBook,
  getAllBooks,
  findBookById,
  findBookByTitle,
  createComment,
};
