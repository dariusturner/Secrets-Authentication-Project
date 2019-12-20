//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets");
          } else {
            res.send("<h1>404</h1><p>Sorry your email or password was incorrect.</p><a href='/'>Try Again</a><style>h1{font-size:8em;text-align:center;margin-bottom: 10px;}p{font-size:2em;text-align:center;}a{font-size:2em;text-align:center;display: block;color: blue;text-decoration: none;}a:hover{color:#33bbff;}</style>");
          }
        });
      } else {
        res.send("<h1>404</h1><p>Sorry that account is not registered for this site.</p><a href='/'>Try Again</a><style>h1{font-size:8em;text-align:center;margin-bottom: 10px;}p{font-size:2em;text-align:center;}a{font-size:2em;text-align:center;display: block;color: blue;text-decoration: none;}a:hover{color:#33bbff;}</style>");
      }
    }
  });
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: username,
      password: hash
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});

app.get("/logout", function(req, res){
  res.render("home");
});


app.listen(port, function(){
  console.log("Server is started on port " + port + ".");
});
