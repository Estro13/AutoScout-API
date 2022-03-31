import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from 'express';
import { ExpressRequestInterface } from '../../types/express.interface';
import { verify } from 'jsonwebtoken';
import { jwtSecret } from '../../config';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    //from request take token, if we have token then decode this token and take user(entity) then search user for id and
    // insert user in req(req.user = user)
    if (!req.headers.authorization) {
      // req.user = null;
      // next();
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const token = req.headers.authorization;

    try {
      const decodedToken = verify(token, jwtSecret);
      const user = await this.userService.findUserById(decodedToken.id);
      req.user = user;
      next();
      return;
    } catch (e) {
      req.user = null;
      next();
    }
    next();
  }
}
