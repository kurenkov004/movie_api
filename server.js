const http = require('http'),
  url = require('url'),
  fs = require('fs');

// creating a server
http.createServer((request, response) => {
  let addr = request.url;
  let q = url.parse(addr, true);
  let filePath = '';  

  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

//checking to see if the directory path name has 'documentation' in it
  if (q.pathname.includes('documentation')){
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

//fetching the actual file using data from the url module
  FileSystem.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text.html'});
    response.write(data);
    response.end();
  });

}).listen(8080);
console.log('My test server is running on Port 8080');
