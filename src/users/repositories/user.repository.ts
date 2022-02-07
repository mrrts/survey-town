import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser, User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.modelName) private userModel: Model<UserDocument>,
  ) {}

  create(data: Partial<IUser>): Promise<IUser> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async updateOne(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await this.userModel.findOne({ uuid: id }).exec();
    return user.updateOne({ $set: data });
  }

  findById(uuid: string): Promise<IUser> {
    return this.userModel.findOne({ uuid }).exec();
  }

  findAll(): Promise<IUser[]> {
    return this.userModel.find().exec();
  }

  findByEmailAddress(emailAddress: string): Promise<IUser> {
    return this.userModel.findOne({ emailAddress }).exec();
  }

  findByHandle(handle: string): Promise<IUser> {
    return this.userModel.findOne({ handle }).exec();
  }
}
