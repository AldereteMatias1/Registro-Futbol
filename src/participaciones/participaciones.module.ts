import { Module } from '@nestjs/common';
import { ParticipacionesController } from './participaciones.controller';
import { ParticipacionesService } from './participaciones.service';

@Module({
  controllers: [ParticipacionesController],
  providers: [ParticipacionesService],
})
export class ParticipacionesModule {}
