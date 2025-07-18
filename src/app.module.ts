import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountsModule } from './modules/users-accounts/users-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-dev-db'),
    UsersAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
