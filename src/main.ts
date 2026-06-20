import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoController } from './aluno.controller';
import { AlunoService } from './aluno.service';
import { Aluno, DB_CONFIG } from './aluno.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_CONFIG.host,
      username: DB_CONFIG.username,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      entities: [Aluno],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Aluno]),
  ],
  controllers: [AlunoController],
  providers: [AlunoService],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000)
}
bootstrap();
