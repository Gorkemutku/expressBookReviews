const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

// Sadece kayıtlı kullanıcılar giriş yapabilir
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Kullanıcı adı veya şifre eksik!"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Kullanıcı başarıyla giriş yaptı!");
  } else {
    return res.status(208).json({message: "Geçersiz giriş bilgileri. Lütfen kontrol edin."});
  }
});

// Add a book review (PUT FONKSİYONU)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review;
  const username = req.session.authorization["username"];

  if (!review) {
      return res.status(400).json({message: "İnceleme içeriği boş olamaz!"});
  }

  if (books[isbn]) {
      books[isbn].reviews[username] = review;
      
      return res.status(200).json({
          message: `ISBN ${isbn} numaralı kitap için inceleme başarıyla eklendi/güncellendi.`,
          reviews: books[isbn].reviews
      });
  } else {
      return res.status(404).json({message: "Kitap bulunamadı."});
  }
}); // <-- İŞTE EKSİK OLAN KAPATMA PARANTEZİ BURASIYDI!

// Bir kitap incelemesini silme (DELETE FONKSİYONU)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization["username"];

  if (books[isbn]) {
      if (books[isbn].reviews[username]) {
          delete books[isbn].reviews[username];
          
          return res.status(200).json({
              message: `ISBN ${isbn} numaralı kitaba ait incelemeniz başarıyla silindi.`,
              reviews: books[isbn].reviews
          });
      } else {
          return res.status(404).json({message: "Bu kitapta size ait silinecek bir inceleme bulunamadı."});
      }
  } else {
      return res.status(404).json({message: "Kitap bulunamadı."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;