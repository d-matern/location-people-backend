import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFields1739362055984 implements MigrationInterface {
  name = 'AddUserFields1739362055984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "socketId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "socketId"`);
  }
}
