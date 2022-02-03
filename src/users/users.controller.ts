import { Controller, Post, Get, UseGuards, Body, Param, Patch, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { USER_ROLES } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Session as ExpressSession } from 'express-session';
import { get } from 'lodash';
import { UpdateSelfDto } from './dto/update-self.dto';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles({ requireAll: [ USER_ROLES.ADMIN ]})
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles({ requireAll: [ USER_ROLES.ADMIN ]})
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return user.safe();
  }

  @Patch('self')
  @Roles({ requireAll: [ USER_ROLES.USER ]})
  async updateSelf(@Body() dto: UpdateSelfDto, @Session() session: ExpressSession) {
    const userId = get(session, '_user.uuid');
    return this.usersService.update(userId, dto);
  }

  @Patch(':userId')
  @Roles({ requireAll: [ USER_ROLES.ADMIN ]})
  async update(@Body() dto: UpdateUserDto, @Param('userId') userId: string) {
    return this.usersService.update(userId, dto);
  }

}
