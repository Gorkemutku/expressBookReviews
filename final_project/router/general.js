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
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // URL'den yazar adını alıyoruz
  const authorName = req.params.author;
  
  // books objesinin tüm anahtarlarını (ISBN numaralarını) bir dizi olarak alıyoruz
  const bookKeys = Object.keys(books);
  
  // Eşleşen kitapları tutacağımız boş bir dizi oluşturuyoruz
  const matchingBooks = [];

  // Anahtarlar üzerinde döngü kuruyoruz
  bookKeys.forEach(key => {
      // Eğer sıradaki kitabın yazarı, aranan yazarla aynıysa
      if (books[key].author === authorName) {
          // Kitabı listeye ekle (hangi ISBN'e sahip olduğunu da görebilmek için key'i de ekliyoruz)
          matchingBooks.push({
              isbn: key,
              author: books[key].author,
              title: books[key].title,
              reviews: books[key].reviews
          });
      }
  });

  // Eğer listede en az 1 kitap varsa listeyi gönder, yoksa 404 hatası dön
  if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
      return res.status(404).json({message: "Bu yazara ait kitap bulunamadı"});
  }
});
// Get all books based on title
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // URL'den kitap başlığını alıyoruz
  const bookTitle = req.params.title;
  
  // books objesinin tüm anahtarlarını çekiyoruz
  const bookKeys = Object.keys(books);
  
  // Eşleşen kitapları tutacağımız dizi
  const matchingBooks = [];

  // Anahtarlar üzerinde döngü kuruyoruz
  bookKeys.forEach(key => {
      // Eğer sıradaki kitabın başlığı, aranan başlıkla aynıysa
      if (books[key].title === bookTitle) {
          matchingBooks.push({
              isbn: key,
              author: books[key].author,
              title: books[key].title,
              reviews: books[key].reviews
          });
      }
  });

  // Eşleşme bulunduysa listeyi gönder, bulunamadıysa 404 dön
  if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
      return res.status(404).json({message: "Bu başlığa sahip kitap bulunamadı"});
  }
});

//  Get book review
// Get book review
public_users.get('/review/:isbn',function (req, res) {
  // İstek atılan URL'den ISBN numarasını çekiyoruz
  const isbn = req.params.isbn;
  
  // Numaraya ait kitabı buluyoruz
  const book = books[isbn];

  if (book) {
      // Kitap bulunduysa sadece 'reviews' (incelemeler) kısmını gönderiyoruz
      return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
      // Kitap bulunamadıysa 404 hatası dönüyoruz
      return res.status(404).json({message: "Kitap bulunamadı"});
  }
});

module.exports.general = public_users;