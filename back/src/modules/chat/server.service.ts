import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: { [key: string]: string } = {}; // Almacena los usuarios conectados por socket ID

  handleConnection(socket: Socket) {
    const connectedUsers = Object.keys(this.users).length;

    // Verifica si ya hay 2 usuarios conectados
    if (connectedUsers >= 2) {
      socket.emit(
        'max-users',
        'El chat está lleno. Solo se permiten 2 usuarios.',
      );
      socket.disconnect(true);
      console.log(`Connection refused: ${socket.id}. Max users reached.`);
      return;
    }

    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    // Emite un mensaje de desconexión y elimina el usuario de la lista
    if (this.users[socket.id]) {
      this.server.emit('user-disconnected', this.users[socket.id]);
      delete this.users[socket.id];
      console.log(`Client disconnected: ${socket.id}`);
    }
  }

  @SubscribeMessage('new-user')
  handleNewUser(socket: Socket, name: string) {
    // Registra al nuevo usuario si pasa la verificación de conexiones
    this.users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    console.log(`User connected: ${name}`);
  }

  @SubscribeMessage('send-chat-message')
  handleMessage(socket: Socket, message: string) {
    // Envía el mensaje solo si el usuario está registrado
    if (this.users[socket.id]) {
      this.server.emit('chat-message', {
        message: message,
        name: this.users[socket.id],
      });
      console.log('Message sent:', message);
    }
  }

  getUsers() {
    // Devuelve una lista de usuarios conectados
    return this.users;
  }
}
