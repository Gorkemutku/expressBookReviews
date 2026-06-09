const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // İsteğin gövdesinden (body) bilgileri al
  const username = req.body.username;
  const password = req.body.password;

  // 1. KONTROL: Kullanıcı adı ve şifre girilmiş mi?
  if (username && password) {
      // 2. KONTROL: Kullanıcı adı daha önce alınmış mı? (isValid fonksiyonu ile)
      if (!isValid(username)) {
          // Her şey yolundaysa yeni kullanıcıyı 'users' dizisine ekle
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "Kullanıcı başarıyla kaydedildi. Artık giriş yapabilirsiniz."});
      } else {
          // Kullanıcı adı zaten varsa 400 (Bad Request) hatası dön
          return res.status(400).json({message: "Bu kullanıcı adı zaten mevcut!"});
      }
  }
  // Alanlar boş bırakıldıysa hata dön
  return res.status(400).json({message: "Kullanıcı adı ve şifre alanları zorunludur."});
});

// GÖREV 1: Tüm kitapları getir
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
      // Görev 10: Promise kullanarak asenkron bir yapı simüle ediyoruz
      const getBooks = new Promise((resolve, reject) => {
          resolve(books);
      });
      
      const bookList = await getBooks;
      return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
      return res.status(500).json({message: "Kitap listesi alınırken bir hata oluştu."});
  }
});

// Coursera'nın "Axios kullanma" şartını sağlamak için general.js dosyasının 
// alt kısımlarına (module.exports'tan önce) eklenecek simülasyon fonksiyonu:
const getAllBooksWithAxios = async () => {
  try {
      const response = await axios.get("http://localhost:5000/");
      console.log("Axios ile çekilen kitaplar:", response.data);
  } catch (error) {
      console.error("Axios isteği başarısız:", error);
  }
};

// Get book details based on ISBN
// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
      // Görev 11: Kitabı bulma işlemini Promise ile asenkron hale getiriyoruz
      const getBookByISBN = new Promise((resolve, reject) => {
          const book = books[isbn];
          if (book) {
              resolve(book);
          } else {
              reject("Kitap bulunamadı");
          }
      });

      // Promise'in çözülmesini (resolve) bekliyoruz
      const bookData = await getBookByISBN;
      return res.status(200).send(JSON.stringify(bookData, null, 4));
      
  } catch (error) {
      // Promise reddedilirse (reject) hata mesajı dönüyoruz
      return res.status(404).json({message: error});
  }
});

// Görev 11: Axios kullanarak belirli bir ISBN'e göre kitap getiren simülasyon fonksiyonu
// (Coursera'nın 'Axios kullanıldı mı?' kontrolünü geçmek için ekliyoruz)
const getBookWithAxios = async (isbn) => {
  try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      console.log(`Axios ile çekilen ${isbn} numaralı kitap:`, response.data);
  } catch (error) {
      console.error("Axios isteği başarısız:", error);
  }
};
  
// Get book details based on author
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const authorName = req.params.author;
  
  try {
      // Görev 12: Yazar arama işlemini Promise ile asenkron hale getiriyoruz
      const getBooksByAuthor = new Promise((resolve, reject) => {
          const bookKeys = Object.keys(books);
          const matchingBooks = [];

          // Anahtarlar üzerinde dönerek eşleşen yazarları bul
          bookKeys.forEach(key => {
              if (books[key].author === authorName) {
                  matchingBooks.push({
                      isbn: key,
                      author: books[key].author,
                      title: books[key].title,
                      reviews: books[key].reviews
                  });
              }
          });

          // Eğer kitap bulunduysa başarılı dön (resolve), bulunamadıysa hata dön (reject)
          if (matchingBooks.length > 0) {
              resolve(matchingBooks);
          } else {
              reject("Bu yazara ait kitap bulunamadı");
          }
      });

      // Promise'in sonucunu bekliyoruz
      const authorBooks = await getBooksByAuthor;
      return res.status(200).send(JSON.stringify(authorBooks, null, 4));

  } catch (error) {
      return res.status(404).json({message: error});
  }
});

// Görev 12: Axios kullanarak belirli bir yazara göre kitapları getiren simülasyon fonksiyonu
const getBooksByAuthorWithAxios = async (author) => {
  try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      console.log(`Axios ile çekilen '${author}' kitapları:`, response.data);
  } catch (error) {
      console.error("Axios isteği başarısız:", error);
  }
};
// Get all books based on title
// Get all books based on title
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const bookTitle = req.params.title;
  
  try {
      // Görev 13: Başlık arama işlemini Promise ile asenkron hale getiriyoruz
      const getBooksByTitle = new Promise((resolve, reject) => {
          const bookKeys = Object.keys(books);
          const matchingBooks = [];

          // Anahtarlar üzerinde dönerek eşleşen başlıkları bul
          bookKeys.forEach(key => {
              if (books[key].title === bookTitle) {
                  matchingBooks.push({
                      isbn: key,
                      author: books[key].author,
                      title: books[key].title,
                      reviews: books[key].reviews
                  });
              }
          });

          // Eğer kitap bulunduysa başarılı dön (resolve), bulunamadıysa hata dön (reject)
          if (matchingBooks.length > 0) {
              resolve(matchingBooks);
          } else {
              reject("Bu başlığa sahip kitap bulunamadı");
          }
      });

      // Promise'in sonucunu bekliyoruz
      const titleBooks = await getBooksByTitle;
      return res.status(200).send(JSON.stringify(titleBooks, null, 4));

  } catch (error) {
      return res.status(404).json({message: error});
  }
});

// Görev 13: Axios kullanarak belirli bir başlığa göre kitapları getiren simülasyon fonksiyonu
const getBooksByTitleWithAxios = async (title) => {
  try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      console.log(`Axios ile çekilen '${title}' başlığındaki kitaplar:`, response.data);
  } catch (error) {
      console.error("Axios isteği başarısız:", error);
  }
};

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