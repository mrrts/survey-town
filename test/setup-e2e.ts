import { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Connection } from "mongoose";
import { IUser, USER_ROLES } from "../src/users/entities/user.entity";

const testUser: Partial<IUser> = {
  emailAddress: "test@test.com",
  passwordHash: "user_does_not_login",
  handle: "Test_User_1",
  uuid: "test-user-1-uuid",
  roles: [USER_ROLES.USER, USER_ROLES.ADMIN]
}

export const enhanceApp = (app: INestApplication) => {
  addMockSessionMiddleware(app);
}

export const clearTestData = async (app: INestApplication) => {
  const connection = app.get<Connection>(getConnectionToken());
  await connection.collection('surveys').deleteMany({})
}

export const closeApp = async (app: INestApplication) => {
  await app.close();
}

const addMockSessionMiddleware = (app: INestApplication) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.session = {
      _user: testUser
    } as any;
  })
}