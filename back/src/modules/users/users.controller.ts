import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { createUserDto } from './userDtos/createUsers.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/enums';
import { RolesGuard } from 'src/guards/roles.guard';
import { updateUserDto } from './userDtos/updateUser.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './users.entity';

@ApiTags('Estudiantes')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.admin, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.usersService.getAll(Number(page), Number(limit));
  }

  @ApiBearerAuth()
  @Roles(Role.admin, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  getId(@Param('id') id: string) {
    return this.usersService.getId(id);
  }

  @ApiBearerAuth()
  @Roles(Role.admin, Role.institution)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('studentsBy/:institutionId')
  async getAllByInstitution(
    @Param('institutionId', ParseUUIDPipe) institutionId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.usersService.getAllByInstitution(
      institutionId,
      page,
      limit,
    );
  }

  @Post('signup')
  signUp(@Body() user: createUserDto) {
    return this.usersService.signUp(user);
  }

  @ApiBearerAuth()
  @Roles(Role.admin, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: updateUserDto,
  ) {
    return this.usersService.updateUser(id, user);
  }

  @ApiBearerAuth()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('asignAdmin/:id')
  async toRoleAdmin(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.toRoleAdmin(id);
  }

  @ApiBearerAuth()
  @Roles(Role.admin, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('changeStatus/:id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: boolean,
  ): Promise<User> {
    return this.usersService.changeStatus(id, status);
  }

  @ApiBearerAuth()
  @Roles(Role.admin, Role.student)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('delete/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
