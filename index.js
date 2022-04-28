/**OLD SCRIPT FILE. PLS IGNORE*/

const http = require('http');
const fs = require('fs');
//const maxAPI = require("max-api");

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    fs.readFile('./index.html', function (err, data) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        res.write(data);
        res.end();
    })
});

server.listen(port, () => {
    console.log('Server running at port 8080');
});

const handlers = {
    [maxAPI.MESSAGE_TYPES.BANG]: () => {
      console.log("got a bang");
    },
    [maxAPI.MESSAGE_TYPES.NUMBER]: (num) => {
    },
    my_message: () => {
      console.log("got my_message");
    },
    my_message_with_args: (arg1, arg2) => {
      console.log("got my arged message: ${arg1}, ${arg2} ");
    },
    [maxAPI.MESSAGE_TYPES.ALL]: (handled, ...args) => {
      console.log("This will be called for ALL messages");
      console.log(`The following inlet event was ${!handled ? "not " : "" }handled`);
      console.log(args);
    }
  };
  
maxAPI.addHandlers(handlers);

maxAPI.addHandler("text", (...args) => {

	//
	// The outlet function sends the arguments right back to Max. Hence, echo.
	maxAPI.outlet(...args);
});


