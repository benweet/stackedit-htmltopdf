//var httpProxy = require("http-proxy");
var http = require('http'),
    fs = require('fs'),
    express = require('express');

// Load config defaults from JSON file.
// Environment variables override defaults.

function loadConfig() {
  var config = JSON.parse(fs.readFileSync(__dirname+ '/config.json', 'utf-8'));
  for (var i in config) {
    config[i] = process.env[i.toUpperCase()] || config[i];
  }
  console.log('Configuration');
  console.log(config);
  return config;
}

var config = loadConfig();
var app = express();

// Convenience for allowing CORS on routes
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    res.header('Access-Control-Allow-Headers', 'content-type, page-size');
    next();
});

app.post('*', function(req, res) {
    var headers = {};
    var pageSize = req.header('page-size');
    pageSize && (headers['page-size'] = pageSize);

    var options = {
        hostname: config.php_server_hostname,
        port: config.php_server_port,
        path: config.php_server_path,
        method: 'POST',
        headers: headers
    };
    var proxyReq = http.request(options, function(proxyRes) {
        proxyRes.pipe(res);
    });
    proxyReq.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    req.pipe(proxyReq);
});

var port = process.env.PORT || config.port || 9999;

app.listen(port, null, function (err) {
    console.log('Server started: http://localhost:' + port);
});

