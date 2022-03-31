import {MigrationInterface, QueryRunner} from "typeorm";

export class a1648732986963 implements MigrationInterface {
    name = 'a1648732986963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" SERIAL NOT NULL, CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token_entity" ("id" SERIAL NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, CONSTRAINT "PK_687443f2a51af49b5472e2c5ddc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "token_entity"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }

}
