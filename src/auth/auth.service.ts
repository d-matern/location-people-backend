import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(data: SignUpDto) {
    const existingUser = await this.getUser(data.username);
    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    // eslint-disable-next-line
    const { password, ...rest } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.usersService.create({ ...rest, password: hashedPassword });
    return { message: 'User registered' };
  }

  async signIn(username: string, pass: string) {
    const user = await this.getUser(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = { sub: user.id, username: user.username };
    return {
      token: await this.jwtService.signAsync(token),
    };
  }

  private async getUser(username: string) {
    return await this.usersService.findOne(username);
  }
}
