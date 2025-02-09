import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  create(username: string, password: string, age: number): Promise<User> {
    const newUser = this.userRepository.create({
      username,
      password,
      age,
    });
    return this.userRepository.save(newUser);
  }

  async getProfile(id: number) {
    const profile = await this.userRepository.findOneBy({ id });
    if (!profile) {
      throw new BadRequestException();
    }

    // eslint-disable-next-line
    const { password, ...result } = profile;
    return result;
  }
}
