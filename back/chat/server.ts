import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3000, { cors: true }) // Puedes especificar el puerto y opciones CORS
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Record<string, string> = {};

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
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
  }

  @SubscribeMessage('send-chat-message')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('chat-message', {
      message: message,
      name: this.users[socket.id],
    });
  }
}
