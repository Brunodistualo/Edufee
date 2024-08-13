import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './userDtos/createUsers.dto';
import { updateUserDto } from './userDtos/updateUser.dto';
import { User } from './users.entity';
import { SendMailsRepository } from '../send-mails/send-mails.repository';
import { Institution } from '../institution/institution.entity';
import { Role } from 'src/enums/enums';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,

    private readonly sendEmailRepository: SendMailsRepository,
  ) {}

  async getAll(page: number, limit: number) {
    const [allUser, count] = await Promise.all([
      this.usersRepository.find({
        skip: (page - 1) * limit,
        take: limit,
        relations: { institution: true },
      }),
      this.usersRepository.count(),
    ]);
    return { allUser, count, page, limit };
  }

  async getId(id: string) {
    const getId = await this.usersRepository.findOne({
      where: { id },
      relations: { institution: true },
    });
    if (!getId) {
      throw new NotFoundException('Usuario con Id no encontrado.');
    }
    return getId;
  }

  async getAllByInstitution(
    institutionId: string,
    page: number,
    limit: number,
  ) {
    const institution = await this.institutionRepository.findOneBy({
      id: institutionId,
    });
    if (!institution) {
      throw new BadRequestException(
        `Este ID: ${institution} no pertenece a una institución`,
      );
    }
    const [users, count] = await Promise.all([
      this.usersRepository.find({
        where: { institution: { id: institutionId } },
        skip: (page - 1) * limit,
        take: limit,
        select: ['id', 'name', 'lastname', 'email', 'dni', 'address', 'phone'],
      }),
      this.usersRepository.count({
        where: { institution: { id: institutionId } },
      }),
    ]);

    return { users, count, page, limit };
  }

  async signUp(user: createUserDto) {
    const { email, dni, institutionName } = user;
    const errors = [];
    const institution = await this.institutionRepository.findOneBy({
      name: institutionName,
    });
    if (!institution) {
      throw new NotFoundException('Institución no encontrada. ');
    }

    const [existsEmail, existsDni, existEmailInstitution] = await Promise.all([
      this.usersRepository.findOneBy({
        email,
      }),
      this.usersRepository.findOneBy({
        dni,
      }),
      this.institutionRepository.findOneBy({
        email,
      }),
    ]);

    if (existEmailInstitution) {
      errors.push({
        fields: 'Email',
        message: 'El email del estudiante ya existe en la base de datos.',
      });
    }

    if (existsEmail) {
      errors.push({
        fields: 'Email',
        message: 'El email del estudiante ya existe en la base de datos.',
      });
    }

    if (existsDni) {
      errors.push({
        fields: 'Dni',
        message: 'El Dni del estudiante ya existe en la base de datos.',
      });
    }
    if (errors.length > 0) {
      throw new ConflictException({
        status: 'error',
        code: 409,
        message: 'Existen conflictos con los datos proporcionados',
        errores: errors,
      });
    }
    const usernew = this.usersRepository.create({ ...user, institution });

    const savedUser = await this.usersRepository.save(usernew);

    await this.sendEmailRepository.sendEmail({
      name: savedUser.name,
      email: savedUser.email,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...rest } = savedUser;
    return {
      message: 'Estudiante registrado exitosamente.',
      data: rest,
    };
  }

  async updateUser(id: string, user: Partial<updateUserDto>) {
    const existingUser = await this.usersRepository.findOneBy({ id });

    if (!existingUser) {
      throw new NotFoundException({
        status: 'error',
        code: 404,
        message: 'El usuario no existe en nuestra base de datos.',
      });
    }

    await this.usersRepository.update(id, user);

    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser;
  }

  async toRoleAdmin(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(
        `Este ID: ${id} no corresponde a un estudiante.`,
      );
    }
    user.role = Role.admin;

    const response = await this.usersRepository.save(user);

    return response;
  }

  async changeStatus(id: string, status: boolean) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(
        `Este ID: ${id} no corresponde a un estudiante`,
      );
    }
    user.status = status;

    const response = await this.usersRepository.save(user);
    return response;
  }

  async deleteUser(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user)
        throw new BadRequestException(`Usuario con ID: ${id} no existente.`);
      const randomString = Math.random().toString(36).substring(2, 10);
      const randomEmail = `deleted_${randomString}@example.com`;
      const randomDni = `${Math.floor(10000000 + Math.random() * 90000000)}`;
      user.name = 'xxxx';
      user.lastname = 'xxxx';
      user.email = randomEmail;
      user.dni = randomDni;
      user.address = 'xxxx';
      user.phone = 'xxxx';
      user.imgProfile = 'xxxx';
      user.status = false;

      await this.usersRepository.save(user);

      return 'Usuario eliminado con éxito';
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar usuario. ${error}`,
      );
    }
  }
}
