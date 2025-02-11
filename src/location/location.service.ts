import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LocationDetectDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  updateUserLocation(data: LocationDetectDto) {
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
    const result = await this.userRepository.query(
      `
        SELECT 
          *, 
          CASE 
            WHEN "birthDate" IS NULL THEN 0 
            ELSE EXTRACT(YEAR FROM AGE("birthDate")) 
          END AS age, 
          ST_X(location::geometry) as lng, 
          ST_Y(location::geometry) as lat, 
          ST_Distance(location::geography, (SELECT location::geography FROM users WHERE id = $1)) AS distance
        FROM users 
        WHERE id != $1 
        AND ST_DWithin(location, (SELECT location FROM users WHERE id = $1), $2) 
        ORDER BY distance;
      `,
      [userId, radius],
    );

    const payload = result.map((r: User) => {
      // eslint-disable-next-line
      const { password, location, ...rest } = r;
      return rest;
    });

    return payload;
  }
}
