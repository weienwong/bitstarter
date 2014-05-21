var express = require('express')
var app = express();
var fs = require('fs');

var buff = fs.readFileSync("index.html");
var str = buff.toString();

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send(str)
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
