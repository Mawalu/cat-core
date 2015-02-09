var db          = require('lowdb')('db.json');
var fs          = require('fs');
var express     = require('express');
var bodyParser  = require('body-parser');
var config      = require('./config.json');

// Setup express
var app = express();

var port = process.env.PORT || config.port || 8123;
var router = express.Router();

// Setup connection to cjdns routers
var cjdns = {};

// Load plugins
fs.readdir('plugins/', function(err, files) {
    if(err) throw err
    files.forEach(function(file) {
        var module = './plugins/' + file;
        if(fs.statSync(module).isFile()) {
            require(module).init(db, cjdns, router);
        }
    });
});

// Start webserver
app.use(bodyParser.json());
app.use('/api', router);
app.listen(port);

// Ready
console.log("Started c-a-t core. API is available at port " + port);
