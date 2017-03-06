const express = require('express');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/forts', require('./api/forts'));


require('./socketio')(io)



// // 80 포트로 소켓을 연다
// var io = require('socket.io').listen(80);

// // connection이 발생할 때 핸들러를 실행한다.
// io.sockets.on('connection', function (socket) {  
// // 클라이언트로 news 이벤트를 보낸다.
//     socket.emit('news', { hello: 'world' });

// // 클라이언트에서 my other event가 발생하면 데이터를 받는다.
// socket.on('my other event', function (data) {  
//         console.log(data);
//     });
// });


server.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});


// server.listen(3000);

// var app = require('express')();
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// io.on('connection', function(){ /* … */ });
// server.listen(3000);
