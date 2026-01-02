import { Module } from '@nestjs/common';
import { GolesController } from './goles.controller';
import { GolesService } from './goles.service';

@Module({
  controllers: [GolesController],
  providers: [GolesService],
})
export class GolesModule {}
