import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('email already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hashedPasswordWithSalt = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPasswordAlongWithSalt = `${salt}.${hashedPasswordWithSalt.toString('hex')}`;

    const user = await this.userService.create(
      email,
      hashedPasswordAlongWithSalt,
    );

    return user;
  }

  signin() {}
}
