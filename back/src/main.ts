import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swaggerConfig';
import { ValidationPipe } from '@nestjs/common';
import * as http from 'http';
import { Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';

const PORT = process.env.PORT || 3005;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000', 'https://edufee.vercel.app/'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  });

  // Crear el servidor HTTP utilizando la aplicación de NestJS
  const server = http.createServer(app.getHttpAdapter().getInstance());

  // Integrar Socket.IO con el servidor HTTP existente
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'https://edufee.vercel.app/'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('new-user', (name) => {
      console.log(`${name} has joined`);
      socket.broadcast.emit('user-connected', name);
    });

    socket.on('send-chat-message', (message) => {
      console.log(`Message from ${socket.id}: ${message}`);
      io.emit('chat-message', {
        message: message,
        name: 'User', // Puedes personalizar el nombre según lo necesites
      });
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      socket.broadcast.emit('user-disconnected', 'User');
    });
  });

  // Iniciar el servidor en el puerto especificado
  await server.listen(PORT);
  console.log(`Server listening on http://localhost:${PORT}`);
}

bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule } from '@nestjs/swagger';
// import { swaggerConfig } from './config/swaggerConfig';
// import { ValidationPipe } from '@nestjs/common';
// import { IoAdapter } from '@nestjs/platform-socket.io';

// const PORT = process.env.PORT || 3005;

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const document = SwaggerModule.createDocument(app, swaggerConfig);
//   SwaggerModule.setup('api', app, document);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//     }),
//   );
//   app.enableCors({
//     origin: ['http://localhost:3000', 'https://edufee.vercel.app/'],
//     methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
//     credentials: true,
//   });
//   // Configura Socket.IO usando el IoAdapter de NestJS
//   app.useWebSocketAdapter(new IoAdapter(app));

//   await app.listen(PORT);
//   console.log(`Server listening on http:localhost:${PORT}`);
// }
// bootstrap();
