//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

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

const secret = "Better-you-than-me!";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  User.findOne({email: req.body.username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === req.body.password) {
          res.render("secrets");
        }
      } else {
        res.send("<h1>404</h1><p>Sorry that account does is not registered for this site.</p><a href='/'>Try Again</a><style>h1{font-size:8em;text-align:center;margin-bottom: 10px;}p{font-size:2em;text-align:center;}a{font-size:2em;text-align:center;display: block;color: blue;text-decoration: none;}a:hover{color:#33bbff;}</style>");
      }
    }
  });
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});


app.listen(port, function(){
  console.log("Server is started on port " + port + ".");
});
