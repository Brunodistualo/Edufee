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

  private users = { message: 'algo' };

  handleConnection(socket: Socket) {
    console.log(`Client connected 12: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.server.emit('user-disconnected', this.users[socket.id]);
    delete this.users[socket.id];
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('new-user')
  handleNewUser(socket: Socket, name: string) {
    this.users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    console.log(`Client disconnected12: ${name}`);
  }

  @SubscribeMessage('send-chat-message')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('chat-message', {
      message: message,
      name: this.users[socket.id],
    });
    console.log('prueba: message', message);
  }
  getUsers() {
    // Devuelve una lista de usuarios conectados
    return this.users;
  }
}
