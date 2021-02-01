let express = require('express');
let fs = require('fs');
let exception = require('./exception.js');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

let users = [{
        name: "Julia",
        messages: [{
            text: "",
            date: new Date()
        }]
    },
    {
        name: "Artem",
        messages: [{
            text: "",
            date: new Date()
        }]
    }
]

app.get('/', function (req, res) {
    res.end(`{"greeting": "Hello World"}`);
})

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('send message', (msg) => { // received message from client
        console.log('message: ' + msg);
        let request = JSON.parse(msg);
        let userIndex = users.findIndex(user => user.name === request.name)
        console.log(userIndex);
        if (users[userIndex].name === request.name) {
            let message = {
                text: request.text,
                date: new Date()
            }
            users[userIndex].messages.push(message);
        } else {
            let user = {
                name: request.name,
                messages: [{
                    text: request.text,
                    date: new Date()
                }]
            }
            users.push(user);
        }
        io.emit('receive message', JSON.stringify(users)); // send received message to the client
    })
});

app.get('/users', function (req, res) {
    res.end(JSON.stringify(users));
})

app.get('/user/:id', function (req, res) {
    const user = users.find(user => user.id == req.params.id)
    if (typeof user === "undefined") {
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