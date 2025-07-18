import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAccountModule } from './modules/users-accounts/users-accounts.module';

@Module({
  imports: [UsersAccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
