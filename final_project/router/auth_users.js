const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  // 'users' dizisinde bu kullanıcı adıyla eşleşen bir kayıt arıyoruz
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  
  // Eğer dizi 0'dan büyükse (yani kullanıcı varsa) true dön
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  // users dizisinde hem kullanıcı adı hem de şifresi eşleşen bir kayıt arıyoruz
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  
  // Eğer eşleşme varsa true, yoksa false dön
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
// Sadece kayıtlı kullanıcılar giriş yapabilir
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Kullanıcı adı veya şifre boş bırakılmış mı kontrolü
  if (!username || !password) {
      return res.status(404).json({message: "Kullanıcı adı veya şifre eksik!"});
  }

  // Fonksiyonumuzla bilgilerin doğruluğunu test ediyoruz
  if (authenticatedUser(username,password)) {
    // Bilgiler doğruysa bir JWT oluşturuyoruz. (Şifre anahtarını "access" yapıyoruz)
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 }); // Token 1 saat (60x60 sn) geçerli olacak

    // Token'ı ve kullanıcı adını tarayıcı oturumuna (session) kaydediyoruz
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Kullanıcı başarıyla giriş yaptı!");
  } else {
    return res.status(208).json({message: "Geçersiz giriş bilgileri. Lütfen kontrol edin."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
