const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    res.status(404).send(JSON.stringify("Both username and password required."));
  }
  if(!isValid(username)){
    res.status(404).send(JSON.stringify("Username already in use."))
  } else {
    users.push({username: username, password: password})
    res.status(201).send(JSON.stringify("User created successfully."))
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books))
    }, 2000);
  })
  res.status(200).send(result);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books[req.params.isbn]))
    }, 2000);
  })
  res.status(200).send(result);
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(Object.values(books).filter(book => book.author === req.params.author)))
    }, 2000);
  })
  res.status(200).send(result);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(Object.values(books).filter(book => book.title === req.params.title)))
    }, 2000);
  })
  res.status(200).send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.status(200).send(JSON.stringify(books[req.params.isbn].reviews))
});

module.exports.general = public_users;
