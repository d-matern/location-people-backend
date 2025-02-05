import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  register(registerAuthDto: RegisterAuthDto) {
    return 'This action adds a new auth';
  }
  login(registerAuthDto: LoginAuthDto) {
    return 'This action adds a new auth';
  }
}
