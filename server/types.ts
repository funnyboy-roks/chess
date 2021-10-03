import { Socket } from "socket.io";


export type Connection = {
	name: string;
	boardId: number;
	socket: Socket;
	opponent: Connection;
};

export type Location = {
	x: number;
	y: number;
};