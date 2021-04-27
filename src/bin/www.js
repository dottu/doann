#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app'
import debugLib from 'debug'
import http from 'http'
import dotenv from 'dotenv'
import { cli } from 'winston/lib/winston/config'
dotenv.config({path: `${__dirname}/../../../.env`})

const debug = debugLib('server:server')

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      /* eslint-disable no-console */
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log(`Listening on ${bind}`);
  debug('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

var io = require('socket.io')(server)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

var usernames = {};
io.on('connection', socket =>{
  //server lắng nghe dữ liệu từ client
  // client.on('Client-sent-data', data  =>{
  //   //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
  //   client.emit("Server-sent-data", data);
  // })
  // when the client emits 'sendchat', this listens and executes
	socket.on('gui_chat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('thong_bao', socket.username, data);
	});
  // when the client emits 'them_thanh_vien', this listens and executes
	// socket.on('them_thanh_vien', function(username){
	// 	// we store the username in the socket session for this client
		socket.username = 'Im Bot';
	// 	// add the client's username to the global list
	// 	usernames[username] = username;
	// 	// echo to client they've connected
		socket.emit('thong_bao', 'Chatbot', 'Chào mừng bạn đến với thế giới sách');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('thong_bao', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('cap_nhat_thanh_vien', usernames);
	// });

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('cap_nhat_thanh_vien', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('thong_bao', 'SERVER', socket.username + ' has disconnected');
	});
})