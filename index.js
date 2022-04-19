const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    fs.readFile('index.html', function (err, data) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        res.write(data);
        res.end();
    })
});

server.listen(port, () => {
    console.log('Server running at port 8080');
});


