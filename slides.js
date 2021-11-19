const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
const port = process.env.PORT || 8080;

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/layout.html'));
});

app.listen(port);
console.log('Server not started at http://localhost:' + port);