import { Module } from '@nestjs/common';
import { ChatGateway } from './server';

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
