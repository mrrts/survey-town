import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { get } from 'lodash';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = get(request, 'session._user');

    if (!user) { return null; }

    return data ? get(user, data) : user;
  }
);