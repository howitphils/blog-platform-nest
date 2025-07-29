import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.respository';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}
}
