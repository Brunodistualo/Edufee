import { Controller, Get } from '@nestjs/common';
import { ChatGateway } from './server.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Get('users')
  getUsers() {
    // Retorna los usuarios conectados
    return this.chatGateway.getUsers();
  }
}
