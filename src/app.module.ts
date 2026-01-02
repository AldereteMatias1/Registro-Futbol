import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { BasicAuthGuard } from './common/auth/basic-auth.guard';
import { JugadoresModule } from './jugadores/jugadores.module';
import { PartidosModule } from './partidos/partidos.module';
import { ParticipacionesModule } from './participaciones/participaciones.module';
import { GolesModule } from './goles/goles.module';
import { ResultadosModule } from './resultados/resultados.module';
import { StatsModule } from './stats/stats.module';
import { RankingsModule } from './rankings/rankings.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    JugadoresModule,
    PartidosModule,
    ParticipacionesModule,
    GolesModule,
    ResultadosModule,
    StatsModule,
    RankingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BasicAuthGuard,
    },
  ],
})
export class AppModule {}
