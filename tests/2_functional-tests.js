/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test("#example Test GET /api/books", function (done) {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(res.body[0], "commentcount", "Books in array should contain commentcount");
  //       assert.property(res.body[0], "title", "Books in array should contain title");
  //       assert.property(res.body[0], "_id", "Books in array should contain _id");
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite("POST /api/books with title => create book object/expect book object", function () {
      test("Test POST /api/books with title", function (done) {
        const bookTitle = "some good book title";
        const postData = { title: bookTitle };
        chai
          .request(server)
          .post("/api/books")
          .set("content-type", "application/x-www-form-urlencoded")
          .send(postData)
          .end((err, res) => {
            const resData = res.body;
            assert.equal(res.status, 200);
            assert.property(resData, "title", "must have a title");
            assert.propertyVal(
              resData,
              "title",
              bookTitle,
              "title must equal 'some good book title'"
            );
            assert.property(resData, "_id");
            assert.property(resData, "comments", "must have comments property");
            assert.isArray(resData.comments, "comments property must be an array");
            done();
          });
      });

      test("Test POST /api/books with no title given", function (done) {
        const postData = {};
        chai
          .request(server)
          .post("/api/books")
          .set("content-type", "application/x-www-form-urlencoded")
          .send(postData)
          .end((err, res) => {
            const resData = res.text;
            assert.equal(res.status, 200);
            assert.equal(resData, "missing required field title");
            done();
          }); //done();
      });
    });

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            const resData = res.body;
            assert.equal(res.status, 200);
            assert.isArray(resData);
            resData.forEach((book) => {
              assert.isObject(book);
              assert.property(book, "title");
              assert.isString(book.title);
              assert.property(book, "comments");
              assert.isArray(book.comments);
              assert.property(book, "commentcount");
              assert.isNumber(book.commentcount);
              done();
            });
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        const invalidId = "60d0328a1f4fed133e3ff357";
        chai
          .request(server)
          .get(`/api/books/${invalidId}`)
          .end((err, res) => {
            const resData = res.text;
            assert.equal(res.status, 200);
            assert.equal(resData, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            const validId = res.body[0]._id;
            chai
              .request(server)
              .get(`/api/books/${validId}`)
              .end((err, res) => {
                const book = res.body;
                assert.isObject(book);
                assert.property(book, "title");
                assert.isString(book.title);
                assert.property(book, "comments");
                assert.isArray(book.comments);
                assert.property(book, "commentcount");
                assert.isNumber(book.commentcount);
                done();
              });
          });
      });
    });

    suite("POST /api/books/[id] => add comment/expect book object with id", function () {
      test("Test POST /api/books/[id] with comment", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, data) => {
            const bookId = data.body[0]._id;
            const comment = "some nice comment";
            const postData = { comment: comment };
            chai
              .request(server)
              .post(`/api/books/${bookId}`)
              .set("content-type", "application/x-www-form-urlencoded")
              .send(postData)
              .end((err, res) => {
                const book = res.body;
                assert.isObject(book);
                assert.property(book, "title");
                assert.isString(book.title);
                assert.property(book, "comments");
                assert.isArray(book.comments);
                assert.property(book, "commentcount");
                assert.isNumber(book.commentcount);
                assert.isTrue(book.comments.some((rescomment) => rescomment === comment));
                done();
              });
          });
      });

      test("Test POST /api/books/[id] without comment field", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, data) => {
            const bookId = data.body[0]._id;
            const postData = {};
            chai
              .request(server)
              .post(`/api/books/${bookId}`)
              .set("content-type", "application/x-www-form-urlencoded")
              .send(postData)
              .end((err, data) => {
                const resData = data.text;
                assert.equal(resData, "missing required field comment");
                done();
              });
          });
      });

      test("Test POST /api/books/[id] with comment, id not in db", function (done) {
        const bookId = "60d0328a1f4fed133e3ff357";
        const postData = { comment: "some cool comment" };
        chai
          .request(server)
          .post(`/api/books/${bookId}`)
          .set("content-type", "application/x-www-form-urlencoded")
          .send(postData)
          .end((err, data) => {
            const resData = data.text;
            assert.equal(resData, "no book exists");
            done();
          });
      });
    });

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, data) => {
            const bookId = data.body[0]._id;
            chai
              .request(server)
              .delete(`/api/books/${bookId}`)
              .end((err, data) => {
                const resData = data.text;
                assert.equal(resData, "delete successful");
                done();
              });
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        const bookId = "60d0328a1f4fed133e3ff357";
        chai
          .request(server)
          .delete(`/api/books/${bookId}`)
          .end((err, data) => {
            const resData = data.text;
            assert.equal(resData, "no book exists");
            done();
          });
      });
    });
  });
});
