import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFields1739371103317 implements MigrationInterface {
  name = 'AddUserFields1739371103317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "socketId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "socketId" character varying`,
    );
  }
}
