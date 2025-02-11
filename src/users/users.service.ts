import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findOne(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  create(data: SignUpDto): Promise<User> {
    const newUser = this.userRepository.create(data);
    return this.userRepository.save(newUser);
  }

  async getProfile(id: number) {
    const result = await this.userRepository.query(
      `
        SELECT 
          *, 
          CASE 
            WHEN "birthDate" IS NULL THEN 0 
            ELSE EXTRACT(YEAR FROM AGE("birthDate")) 
          END AS age, 
          ST_X(location::geometry) as lng, 
          ST_Y(location::geometry) as lat 
        FROM users 
        WHERE id = $1;
      `,
      [id],
    );
    if (!result || result.length === 0) {
      throw new BadRequestException();
    }

    // eslint-disable-next-line
    const { password, location, ...profile } = result[0];
    return profile;
  }
}
