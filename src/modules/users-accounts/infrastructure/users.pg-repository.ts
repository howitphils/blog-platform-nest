/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersPgRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createUser(dto: CreateUserDto) {
    return this.dataSource.query(
      `
      INSERT INTO
        users (login, email, passwordHash)
      VALUES
        ($1, $2, $3)
      `,
      [dto.login, dto.email, dto.password],
    );
  }

  async getUsers() {
    return this.dataSource.query(`
     SELECT
        *
      FROM
      users
      `);
  }

  async getUser(id: string) {
    return this.dataSource.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [id],
    );
  }

  async deleteUser(id: string) {
    return this.dataSource.query(
      `
     DELETE FROM users 
     WHERE id = $1
      `,
      [id],
    );
  }

  // async getUser() {
  //   this.dataSource.query(`asd`);
  // }
  // async getUserByIdOrFail(id: string): Promise<UserDbDocument> {
  //   const user = await this.UserModel.findById(id);

  //   if (!user) {
  //     throw new DomainException(
  //       'User is not found',
  //       DomainExceptionCodes.NotFound,
  //     );
  //   }

  //   return user;
  // }

  // async getUserByLoginOrEmail(
  //   loginOrEmail: string,
  // ): Promise<UserDbDocument | null> {
  //   return this.UserModel.findOne({
  //     $or: [
  //       { 'accountData.email': { $regex: loginOrEmail, $options: 'i' } },
  //       { 'accountData.login': { $regex: loginOrEmail, $options: 'i' } },
  //     ],
  //   });
  // }

  // async getUserByEmail(email: string): Promise<UserDbDocument | null> {
  //   return this.UserModel.findOne({
  //     'accountData.email': email,
  //   });
  // }

  // async getUserByCredentials(
  //   login: string,
  //   email: string,
  // ): Promise<UserDbDocument | null> {
  //   return this.UserModel.findOne({
  //     $or: [{ 'accountData.email': email }, { 'accountData.login': login }],
  //   });
  // }

  // async getUserByConfirmationCode(
  //   confirmationCode: string,
  // ): Promise<UserDbDocument | null> {
  //   return this.UserModel.findOne({
  //     'emailConfirmation.confirmationCode': confirmationCode,
  //   });
  // }

  // async getUserByRecoveryCode(code: string): Promise<UserDbDocument | null> {
  //   return this.UserModel.findOne({
  //     'passwordRecovery.recoveryCode': code,
  //   });
  // }
}
