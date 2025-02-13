import { Column, Entity, Point, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    default: () => `ST_GeomFromText('POINT(0 0)', 4326)`,
  })
  location: Point;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  vk: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  telegram: string;
}
