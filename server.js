let express = require('express');
let fs = require('fs');
let exception = require('./exception.js');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{cors:{origin:"*"}});

let users = [{
    id: 1,
    firstName: "Julia",
    lastName: "Firsova"
},
{
    id: 2,
    firstName: "Artem",
    lastName: "Firsov"
}]


app.get('/', function (req, res) {
    res.end(`{"greeting": "Hello World"}`);
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    
  });

app.get('/users', function (req, res) {
    res.end(JSON.stringify(users));
})

app.get('/user/:id', function (req, res) {
    const user = users.find(user => user.id == req.params.id)
    if(typeof user === "undefined"){
        throw new exception.HttpNotFound('Not found')
    }
    res.end(JSON.stringify(user));
})

app.use((err, req, res, next) => {
    if (err instanceof exception.HttpError) {
      return res.status(err.code).send(err.message);
    }
    res.sendStatus(500);
  });

/*let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port
    console.log("Listening at http://%s:%s", host, port)
})*/
server.listen(8081, function () {
    console.log('listening on *:8081');
  });
    