var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var api = require('./routes/api');

var app = express();
var port = process.env.PORT || 4050;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', api);

app.listen(port, function(){
  console.log('Server listening on port: ', port);
})

module.exports = app;
