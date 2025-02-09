import { Column, Entity, Point, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: '' })
  avatar: string;

  @Column()
  age: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    default: () => `ST_GeomFromText('POINT(0 0)', 4326)`,
  })
  location: Point;
}
