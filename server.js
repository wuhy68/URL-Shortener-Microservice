'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var IsURL = require('./test').IsURL;
var Url = require('./models/url');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
  .then(() => console.log('connection successfully'))
  .catch((err) => console.error(err));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.route("/api/shorturl/new")
  .post((req, res) => {
    if(IsURL(req.body.url) === false){
      res.json({
        "error":"Wrong Format"
      });
    }
    else{
      Url.find((err, data) => {
        if(err) console.log(err);
        else{
          var linkList = data.map((obj) => {
            obj.shortUrl
          });
          var newLink = Math.round(Math.random()*10000)

          while(linkList.includes(newLink)){
            newLink = Math.round(Math.random()*10000);
          }

          Url.create({url: req.body.url, shortUrl: newLink}, (err, data) => {
            if(err) console.log(err);
            else{
              res.json(data);
            }
          });
        }
      });
    }
  });

app.route("/api/shorturl/:shorturl")
  .get((req, res) => {
    Url.find({shortUrl: req.params.shorturl}, (err, data) => {
      if(err){
        console.log(err);
      }
      else{
        res.redirect(data[0].url);
      }
    });
  });

app.listen(port, function () {
  console.log('Node.js listening ...');
});