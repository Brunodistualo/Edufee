import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesUserService {
  constructor(
    private readonly filesRepository: FilesRepository,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async uploadImage(file: Express.Multer.File, userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const response = await this.filesRepository.uploadImage(file);
    if (!response.secure_url) {
      throw new NotFoundException('Error al subir imagen en Cloudinary');
    }

    try {
      await this.usersRepository.update(userId, {
        imgProfile: response.secure_url,
      });
    } catch (error) {
      throw new NotFoundException('Error al actualizar la imagen del usuario');
    }

    const updatedUser = await this.usersRepository.findOneBy({ id: userId });
    if (!updatedUser) {
      throw new NotFoundException(
        'Usuario no encontrado después de la actualización',
      );
    }

    return updatedUser;
  }
}
