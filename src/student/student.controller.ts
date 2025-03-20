import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateStudentWithUserDto } from './dto/create-student-with-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../common';
import { SearchDto } from 'src/common/dto/search.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('with-user')
  createWithUser(@Body() createStudentWithUserDto: CreateStudentWithUserDto) {
    return this.studentService.createWithUser(createStudentWithUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() searchAndPaginationDto: SearchDto) {
    return this.studentService.findAll(searchAndPaginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user) {
    return this.studentService.findByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('nim/:nim')
  findByNim(@Param('nim') nim: string) {
    return this.studentService.findByNim(nim);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @CurrentUser() user,
  ) {
    // Allow students to update only their own profile
    if (user.role === UserRole.STUDENT) {
      // First check if this student belongs to the current user
      return this.studentService.findByUserId(user.id).then((student) => {
        if (student.id !== id) {
          throw new Error('You can only update your own profile');
        }
        return this.studentService.update(id, updateStudentDto);
      });
    }

    // Admins can update any student
    return this.studentService.update(id, updateStudentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
