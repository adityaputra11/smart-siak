import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SemesterService } from './semester.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiController } from '../common/decorators/controller-api.decorator';
import { API_PATHS } from '../common/constants/api-paths.constants';

@ApiController(API_PATHS.SEMESTERS.ROOT)
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.semesterService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  findActive() {
    return this.semesterService.findActive();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semesterService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semesterService.update(id, updateSemesterDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semesterService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/student')
  getStudentDashboard(
    @CurrentUser() user,
    @Query('semesterId') semesterId?: string,
  ) {
    return this.semesterService.getStudentSemesterDashboard(
      user.studentId,
      semesterId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('dashboard/student/:studentId')
  getStudentDashboardByAdmin(
    @Param('studentId') studentId: string,
    @Query('semesterId') semesterId?: string,
  ) {
    return this.semesterService.getStudentSemesterDashboard(
      studentId,
      semesterId,
    );
  }
}
