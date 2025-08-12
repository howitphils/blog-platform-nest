import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreConfig } from './core.config';

@Module({
  imports: [CqrsModule],
  providers: [CoreConfig],
  exports: [CqrsModule, CoreConfig],
})
export class CoreModule {}
