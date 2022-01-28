import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from 'src/password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser, User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.modelName) private userModel: Model<UserDocument>,
    private passwordService: PasswordService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const passwordHash = await this.passwordService.generateHash(createUserDto.plaintextPassword);
    const user = new this.userModel({
      emailAddress: createUserDto.emailAddress,
      passwordHash
    });
    const savedUser = await user.save();
    savedUser.passwordHash = null;
    return savedUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  findByEmailAddress(emailAddress: string): Promise<IUser> {
    return this.userModel.findOne({ emailAddress }).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
