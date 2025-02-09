import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  updateUserLocation(data: LocationDto) {
    const { userId, lng, lat } = data;
    return this.userRepository
      .createQueryBuilder()
      .update()
      .set({
        location: () => `ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)`,
      })
      .where('id = :userId', { userId })
      .setParameters({ lng, lat })
      .execute();
  }

  async getNearbyUsers(userId: number, radius: number = 5000) {
    return this.userRepository.query(
      `
        SELECT id, username, 
        ST_X(location::geometry) as lng, 
        ST_Y(location::geometry) as lat
        FROM users
        WHERE id != $1
        AND ST_DWithin(location, (SELECT location FROM users WHERE id = $1), $2);
      `,
      [userId, radius],
    );
  }
}
