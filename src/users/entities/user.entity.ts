import { SchemaOptions } from '@nestjs/mongoose';
import { Schema, Document, Model, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum USER_ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface IUser {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  emailAddress: string;
  passwordHash: string;
  roles: USER_ROLES[];
  safe: () => IUser;
}

const options: SchemaOptions = {
  collection: 'users'
};

export const userSchema = new Schema<IUser>({
  uuid: { type: String, required: true, default: () => uuidv4(), unique: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  emailAddress: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], required: true, default: () => [USER_ROLES.USER] }
}, options);

userSchema.methods.safe = function () {
  this.passwordHash = null;
  return this;
}

export const User: Model<IUser> = model('User', userSchema);

export type UserDocument = IUser & Document;