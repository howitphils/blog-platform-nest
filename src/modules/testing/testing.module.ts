import { Module } from '@nestjs/common';
import { TestingAllDataController } from './testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users-accounts/domain/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TestingAllDataController],
})
export class TestingModule {}
