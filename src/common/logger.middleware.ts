import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';
import { get } from 'lodash';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timestamp = format(new Date(), 'yyyy-MM-dd h:mm:ssaaa');
    const method = req.method;
    const path = req.path;
    const emailAddress = get(
      req,
      'session._user.emailAddress',
      'unauthenticated',
    );

    const message = `${timestamp} [User: ${emailAddress}] ${method} ${path}`;

    console.log(message);

    next();
  }
}
