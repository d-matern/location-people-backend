import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFields1739358787747 implements MigrationInterface {
  name = 'AddUserFields1739358787747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isOnline" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isOnline"`);
  }
}
