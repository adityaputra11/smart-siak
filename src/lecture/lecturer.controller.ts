import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';
import { CreateLecturerWithUserDto } from './dto/create-lecturer-with-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiController } from '../common/decorators/controller-api.decorator';
import { API_PATHS } from '../common/constants/api-paths.constants';

@ApiController(API_PATHS.LECTURERS.ROOT)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createLecturerDto: CreateLecturerDto) {
    return this.lecturerService.create(createLecturerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(API_PATHS.LECTURERS.WITH_USER)
  createWithUser(@Body() createLecturerWithUserDto: CreateLecturerWithUserDto) {
    return this.lecturerService.createWithUser(createLecturerWithUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.lecturerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_PATHS.LECTURERS.PROFILE)
  getProfile(@CurrentUser() user) {
    return this.lecturerService.findByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(`${API_PATHS.LECTURERS.BY_NIP}/:nip`)
  findByNip(@Param('nip') nip: string) {
    return this.lecturerService.findByNip(nip);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LECTURER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLecturerDto: UpdateLecturerDto,
    @CurrentUser() user,
  ) {
    // Allow lecturers to update only their own profile
    if (user.role === UserRole.LECTURER) {
      // First check if this lecturer belongs to the current user
      return this.lecturerService.findByUserId(user.id).then((lecturer) => {
        if (lecturer.id !== id) {
          throw new Error('You can only update your own profile');
        }
        return this.lecturerService.update(id, updateLecturerDto);
      });
    }

    // Admins can update any lecturer
    return this.lecturerService.update(id, updateLecturerDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturerService.remove(id);
  }
}
