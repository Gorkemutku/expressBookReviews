const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// GÖREV 1: Tüm kitapları getir
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // İstek atılan URL'den ISBN numarasını (parametreyi) çekiyoruz
  const isbn = req.params.isbn;
  
  // books objesinden o numaraya sahip kitabı buluyoruz
  const book = books[isbn];

  if (book) {
      // Kitap bulunduysa 200 (OK) koduyla kitabı gönder
      return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
      // Kitap bulunamadıysa 404 (Not Found) hatası dön
      return res.status(404).json({message: "Kitap bulunamadı"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;