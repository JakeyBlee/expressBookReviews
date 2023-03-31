const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return users.filter(user => user.username === username).length === 0;
}

const authenticatedUser = (username, password)=>{
  let validUsers = users.filter(user => user.username === username && user.password === password);
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    res.status(404).send(JSON.stringify("Both username and password required."));
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60* 60 });

    req.session.authorization = {
      accessToken, username
    };

    res.status(200).send("User successfully logged in.");
  } else {
    res.status(403).send(JSON.stringify("Incorrect username or password."));
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  const review = req.body.review;
  books[req.params.isbn].reviews[username] = review;
  res.status(201).send(JSON.stringify("Review submitted successfully."))
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  if(Object.keys(books[req.params.isbn].reviews).includes(username)){
    delete books[req.params.isbn].reviews[username];
    res.status(204).send();
  } else {
    res.status(404).send(JSON.stringify("Review not found."))
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
