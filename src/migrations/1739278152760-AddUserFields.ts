import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFields1739278152760 implements MigrationInterface {
  name = 'AddUserFields1739278152760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "gender" character varying NOT NULL, "birthDate" date NOT NULL, "phone" character varying, "vk" character varying, "instagram" character varying, "telegram" character varying, "location" geography(Point,4326) NOT NULL DEFAULT ST_GeomFromText('POINT(0 0)', 4326), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
