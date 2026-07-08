import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get()
  async list(@Query('name') name?: string): Promise<Student[]> {
    return this.service.list(name);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number): Promise<Student> {
    return this.service.find(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateStudentDto): Promise<Student> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateStudentDto,
  ): Promise<Student> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
