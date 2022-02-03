import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { get } from 'lodash';
import { IUser, USER_ROLES } from "../users/entities/user.entity";
import { RolesConfig } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext) {
    const rolesConfig = this.reflector.get<RolesConfig>('roles', context.getHandler());

    if (!rolesConfig) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user: IUser = get(request, 'session._user');

    if (!user || !user.roles) {
      return false;
    }

    if (rolesConfig.requireAll) {
      return rolesConfig.requireAll.every((requiredRole: USER_ROLES) =>
        user.roles.includes(requiredRole));
    }

    if (rolesConfig.requireOne) {
      return rolesConfig.requireOne.some((requiredRole: USER_ROLES) =>
        user.roles.includes(requiredRole));
    }

  }
}