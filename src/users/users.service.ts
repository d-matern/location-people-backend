import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findOne(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ username });
  }

  create(data: SignUpDto): Promise<UserEntity> {
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
    const { password, location, socketId, ...profile } = result[0];
    return profile;
  }
}
