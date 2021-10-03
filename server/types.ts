import { Socket } from "socket.io";


export type Connection = {
	name: string;
	boardId: number;
	socket: Socket;
	opponent: Connection;
	colour: Colour;
};

export type Location = {
	x: number;
	y: number;
};

export type Colour = 'white' | 'black';