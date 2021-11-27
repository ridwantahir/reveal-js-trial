const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/demo.html'));
});
app.get('/basic', function(req, res) {
    res.sendFile(path.join(__dirname, '/basic.html'));
  });
  app.get('/basictable', function(req, res) {
    res.sendFile(path.join(__dirname, '/basictable.html'));
  });
  app.get('/basiccodesample', function(req, res) {
    res.sendFile(path.join(__dirname, '/basiccodesample.html'));
  });
  app.get('/layout', function(req, res) {
    res.sendFile(path.join(__dirname, '/layout.html'));
  });
  app.get('/table', function(req, res) {
    res.sendFile(path.join(__dirname, '/table.html'));
  });
  app.get('/layout1', function(req, res) {
    res.sendFile(path.join(__dirname, '/layout1.html'));
  });
  app.get('/layout2', function(req, res) {
    res.sendFile(path.join(__dirname, '/layout2.html'));
  });
app.listen(port);
console.log('Server not started at http://localhost:' + port);