var express = require('express');
var http = require('http');
var cool = require('cool-ascii-faces');

var requestify = require('requestify'); 

var dateTime = require('node-datetime');

var firebase = require('firebase');

var gmailNode = require('gmail-node');

var clientSecret = {
    installed: {
        client_id: "601728468323-00stvh0aj7qpqovoji7hiu311d49s0g5.apps.googleusercontent.com",
        project_id: "transferhelperv2-167003",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://accounts.google.com/o/oauth2/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_secret: "YiGtroMEkMg5VMo1ZiQ4ZVaT",
        redirect_uris: [
            "http://localhost:8080",
            "https://mysterious-caverns-56555.herokuapp.com"
        ]
    }
};


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



app.get('/me_email', function(request, response) {

var message = " 轉帳Mail: " + request.query.email + " 轉帳名字: " + request.query.firstname+request.query.lastname + " 轉帳金額: " + request.query.Amount

// Message 
var testMessage = {
    to: request.query.email,
    subject: "[轉帳幫]轉入",
    message: message
};
 
// ClientSecret: 
gmailNode.init(clientSecret, './token.json', initComplete);
 
function initComplete(err, dataObject) {
    if(err){
        	console.log('Error ', err);
    }else {
        gmailNode.send(testMessage, function (err, data) {
            console.log(err,data);
        });
    }
}

	response.send('{"messages":[{"text":"send email"}]}');
});


app.get('/to_email', function(request, response) {

var message = "轉帳Mail: " + request.query.Toemail + " 轉帳帳戶: " + request.query.Toaccount + " 轉帳金額: " + request.query.Amount

// Message 
var testMessage = {
    to: request.query.Toemail,
    subject: "[轉帳幫]轉出",
    message: message
};
 
// ClientSecret: 
gmailNode.init(clientSecret, './token.json', initComplete);
 
function initComplete(err, dataObject) {
    if(err){
        	console.log('Error ', err);
    }else {
        gmailNode.send(testMessage, function (err, data) {
            console.log(err,data);
        });
    }
}

	response.send('{"messages":[{"text":"send email"}]}');
});


app.get('/api', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   	//console.log("ddos:" + request.url);
   	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	//console.log(formatted);
   	Invokpostdata(request.query.email,request.query.Toaccount,request.query.Toemail,request.query.Amount,request.query.account,formatted);
   	response.send('{"messages":[{"text":"in db"}]}');
});

var datalist;
app.get('/get', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   //console.log("ddos:" + request.url);
   Getdata(request.query.email, function() {
   		var counts = getKeys(datalist);
   		//console.log("D:" + JSON.stringify(datalist));
   		var Amounts ;
   		var Emails ;
   		var Toaccounts ;
   		var Toemails ;
   		var SrtingPonse;

   		for(i=0;i<=(counts.length-1);i++){
   			var keyc = counts[i];
   			Amounts = datalist[keyc].Amount;
			Emails = datalist[keyc].Email;
			Toaccounts = datalist[keyc].Toaccount;
			Toemails = datalist[keyc].Toemail;
			SrtingPonse += Emails +" to " +Toaccounts+" by "+Toaccounts+" Amounts:"+ Amounts  ;

   		}

   		response.send('{"messages":[{"text":'+'"'+SrtingPonse.toString()+'"'+'}]}');
		//console.log("D:" + datalist[keyc].Amount);
		//console.log("Dw:" + counts.length);
   	 	//response.send('HI');
   });


   //length();
   //var obj = JSON.stringify(datalist);



   //for()

   //response.send('{"messages":[{"text":'+request.query.email+'}]}');
});

///////////////////////////
app.get('/wsepost', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   	//console.log("ddos:" + request.url);
   	var dt = dateTime.create();
	var _date = dt.format('Y-m-d');
	var _time = dt.format('H:M:S');
	//console.log(formatted);
   	Invokwsepostdata(request.query.user_id,_date,_time,request.query.eatname,request.query.imageurl,request.query.name);
   	
   	response.send('{"messages":[{"text":"你吃了'+request.query.eatname+'"}]}');

});

app.get('/wseget', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   	//console.log("ddos:" + request.url);
   	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	//console.log(formatted);
   	Invokpostdata(request.query.email,request.query.Toaccount,request.query.Toemail,request.query.Amount,request.query.account,formatted);
   	response.send('{"messages":[{"text":"in db"}]}');
});

//oneP
//////////////////////////////////////////////////////////////
app.get('/onepPost', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   	//console.log("ddos:" + request.url);
   	var dt = dateTime.create();
	var _date = dt.format('Y-m-d');
	var _time = dt.format('H:M:S');
	//console.log(formatted);
	
	//user, date, time, fbName, size, phone, address, name, status, settlement, note, fbId ,fbImage ,q ,ref
   	
   	invokOnepPostData(request.query.user, _date, _time, request.query.fbName,request.query.size, request.query.phone, request.query.address, request.query.name, "0", "0", "無", request.query.fbId, request.query.fbImage, request.query.q, request.query.ref);
   	
   	response.send('{"messages":[{"text":"感謝您訂單送出!"}]}');

});



var getKeys = function(obj){
	var keys = [];
   for(var key in obj){

   		console.log("D:" + key);
   		//console.log("D:" + obj[0]);
      keys.push(key);
   }
   return keys;
}


app.get('/index', function(request, response) {

	console.log("Got response: " + response.statusCode);
   console.log("ddos:" + request.url);
  	response.render('pages/index');
});

app.get('/page', function(request, response) {

	console.log("Got response: " + response.statusCode);
   console.log("ddos:" + request.url);
  	response.render('pages/page1');
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


function Invokpostdata(email,Toaccount,Toemail,Amount,account,date)
{
	requestify.request('https://transferhelper-6fc9a.firebaseio.com/users.json', {
	    method: 'POST',
	    body: {
	        Email: email,
	        Toaccount: Toaccount,
	        Toemail:Toemail,
	        Amount:Amount,
	        Account:account,
	        DateTime:date
	    },
	    headers: {
	        'X-Forwarded-By': 'me'
	    },
	    cookies: {
	        mySession: 'some cookie value'
	    },
	    auth: {
	        // username: 'foo',
	        // password: 'bar'
	    },
	    dataType: 'json'        
	})
	.then(function(response) {
	    // get the response body
	    response.getBody();

	    // get the response headers
	    response.getHeaders();

	    // get specific response header
	    response.getHeader('Accept');

	    // get the code
	    response.getCode();

	    // Get the response raw body
	    response.body;
	});
}

function Getdata(email,callback)
{
	requestify.request('https://transferhelper-6fc9a.firebaseio.com/users.json', {
	    method: 'get',
	    headers: {
	        'X-Forwarded-By': 'me'
	    },
	    cookies: {
	        mySession: 'some cookie value'
	    },
	    auth: {
	        // username: 'foo',
	        // password: 'bar'
	    },
	    dataType: 'json'        
	})
	.then(function(response) {
	    // get the response body
	    response.getBody();

	    // get the response headers
	    response.getHeaders();

	    // get specific response header
	    response.getHeader('Accept');

	    // get the code
	    response.getCode();

	    // Get the response raw body
	    response.body;

	    datalist = response.getBody();
	    callback();

	});
}


////////////////

function Invokwsepostdata(user,date,time,ename,url,name)
{
	requestify.request('https://wseteambuilding.firebaseio.com/'+user+'.json', {
	    method: 'POST',
	    body: {
	        date: date,
	        time: time,
	        eat:ename,
	        image:url,
	        name:name
	    },
	    headers: {
	        'X-Forwarded-By': 'me'
	    },
	    cookies: {
	        mySession: 'some cookie value'
	    },
	    auth: {
	        // username: 'foo',
	        // password: 'bar'
	    },
	    dataType: 'json'        
	})
	.then(function(response) {
	    // get the response body
	    response.getBody();

	    // get the response headers
	    response.getHeaders();

	    // get specific response header
	    response.getHeader('Accept');

	    // get the code
	    response.getCode();

	    // Get the response raw body
	    response.body;
	});
}


//onep
//////////////////////////

function invokOnepPostData(user, date, time, fbName, size, phone, address, name, status, settlement, note, fbId, fbImage, q, ref)
{
	requestify.request('https://onepbackend.firebaseio.com/'+user+'.json', {
	    method: 'POST',
	    body: {
	        date: date,
	        time: time,
	        fbName:fbName,
	        size:size,
	        phone:phone,
	        address:address,
	        name:name,
	        status:status,
	        settlement:settlement,
	        note:note,
	        fbId:fbId,
	        fbImage:fbImage,
	        quantity:q,
	        ref:ref
	    },
	    headers: {
	        'X-Forwarded-By': 'me'
	    },
	    cookies: {
	        mySession: 'some cookie value'
	    },
	    auth: {
	        // username: 'foo',
	        // password: 'bar'
	    },
	    dataType: 'json'        
	})
	.then(function(response) {
	    // get the response body
	    response.getBody();

	    // get the response headers
	    response.getHeaders();

	    // get specific response header
	    response.getHeader('Accept');

	    // get the code
	    response.getCode();

	    // Get the response raw body
	    response.body;
	});
}


