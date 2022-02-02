import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser, User, UserDocument } from "../entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.modelName) private userModel: Model<UserDocument>
  ) {}

  create(data: Partial<IUser>): Promise<IUser> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  findByEmailAddress(emailAddress: string): Promise<IUser> {
    return this.userModel.findOne({ emailAddress }).exec();
  }

}