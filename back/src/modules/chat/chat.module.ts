import { Module } from '@nestjs/common';
import { ChatGateway } from './server.service';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
