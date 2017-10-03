// Importing the connection to the `bookshelf` db.
var bookshelfConn = require('./database');

// Importing the Mongoose model we'll use to write to the db.
var Book = require('./models/Book');

// Importing the Data to populate the db.
var books = require('./dataset');

// When the connection is ready, do the music!
bookshelfConn.on('open', function () {
  // Here we'll keep an array of Promises
  var booksOps = [];

  // We drop the db as soon the connection is open
  bookshelfConn.db.dropDatabase(function () {
    console.log('Database dropped');
  });

  // Creating a Promise for each save operation
  books.forEach(function (book) {
    booksOps.push(saveBookAsync(book));
  });

  // Running all the promises sequentially, and THEN
  // closing the database.
  Promise.all(booksOps).then(function () {
    bookshelfConn.close(function () {
      console.log('Mongoose connection closed!');
    });
  });

  // This function returns a Promise.
  function saveBookAsync (book) {
    return new Promise(function (resolve, reject) {
      new Book(book).save(function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
});