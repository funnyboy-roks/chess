import express = require('express');
import morgan = require('morgan');
import { Server } from 'socket.io';
import * as users from './Users';


const app = express();
const http = require('http').Server(app);
const io: Server = require('socket.io')(http);
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.static('client'));

io.on('connection', users.connect);

http.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
