var express = require('express');
var http = require('http');
var cool = require('cool-ascii-faces');

var app = express();

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {

	console.log("Got response: " + response.statusCode);
   console.log("ddos:" + request.url);
  response.send('Hello World!');
});

app.get('/index', function(request, response) {

	console.log("Got response: " + response.statusCode);
   console.log("ddos:" + request.url);
  	response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});



http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
  resp.on('data', function(ip) {
    console.log("My public IP address is: " + ip);
  });
});