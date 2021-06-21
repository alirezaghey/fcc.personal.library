/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const db = require("./../db");
module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      db.getAllBooks((err, books) => {
        if (err || !books) {
          console.log(err);
          return res.json({ error: "No data to show" });
        }
        const result = [];
        books.forEach((book) => {
          const new_book = {};
          new_book.title = book.title;
          new_book._id = book._id;
          new_book.commentcount = book.comments.length;
          new_book.comments = [...book.comments];
          result.push(new_book);
        });
        return res.json(result);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) return res.send("missing required field title");
      db.createBook(title, (err, data) => {
        if (err || !data) {
          console.log(err);
          return res.json({ error: "an error occured" });
        }
        return res.json(data);
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      db.deleteAllBooks((err, data) => {
        if (err || !data) {
          console.log(err);
          return res.json({ error: "an error occured" });
        }
        return res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      db.findBookById(bookid, (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ error: "an error occured" });
        }
        if (!data) {
          return res.send("no book exists");
        }
        const new_book = {};
        new_book.title = data.title;
        new_book._id = data._id;
        new_book.commentcount = data.comments.length;
        new_book.comments = [...data.comments];
        return res.json(new_book);
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) return res.send("missing required field comment");
      db.createComment(bookid, comment, (err, book) => {
        if (err) {
          console.log(err);
          return res.json({ error: "an error occured" });
        }
        if (!book) {
          return res.send("no book exists");
        }
        const new_book = {};
        new_book.title = book.title;
        new_book._id = book._id;
        new_book.commentcount = book.comments.length;
        new_book.comments = [...book.comments];
        return res.json(new_book);
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      db.deleteBook(bookid, (err, data) => {
        if (err) {
          console.log(err);
          return res.json({ error: "an error occured" });
        }
        if (!data) {
          return res.send("no book exists");
        }
        return res.send("delete successful");
      });
    });
};
