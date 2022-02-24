import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Param,
  Patch,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, createUserDtoSchema } from './dto/create-user.dto';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { IUser, USER_ROLES } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Session as ExpressSession } from 'express-session';
import { get } from 'lodash';
import { UpdateSelfDto } from './dto/update-self.dto';
import { IAppSession } from '../auth/entities/session.entity';
import { SchemaValidatorPipe } from '../common/schema-validator.pipe';
import { User } from '../common/user.decorator';

@Controller('api/users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles({ requireAll: [USER_ROLES.ADMIN] })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles({ requireAll: [USER_ROLES.ADMIN] })
  async create(@Body(new SchemaValidatorPipe(createUserDtoSchema)) dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return user.safe();
  }

  // Used to restore session on client when refreshing browser
  @Get('self')
  async getSelfFromSession(
    @User() user: IUser
  ) {
    return user?.safe();
  }

  @Patch('self')
  @Roles({ requireAll: [USER_ROLES.USER] })
  async updateSelf(
    @Body() dto: UpdateSelfDto,
    @User('uuid') userId: string
  ) {
    return this.usersService.update(userId, dto);
  }

  @Patch(':userId')
  @Roles({ requireAll: [USER_ROLES.ADMIN] })
  async update(@Body() dto: UpdateUserDto, @Param('userId') userId: string) {
    return this.usersService.update(userId, dto);
  }

  @Get('handles')
  @Roles({ requireAll: [USER_ROLES.USER] })
  findAllHandles() {
    return this.usersService.findAllHandles();
  }
}
