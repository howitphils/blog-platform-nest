import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  getUsers() {
    return [{ id: 1 }, { id: 2 }];
  }
}
