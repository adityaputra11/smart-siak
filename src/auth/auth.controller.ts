import { Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './guards/roles.guard';
import { ApiController } from '../common/decorators/controller-api.decorator';
import { API_PATHS } from '../common/constants/api-paths.constants';
import { LoginDto } from './dto/login.dto';

@ApiController(API_PATHS.AUTH.ROOT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(API_PATHS.AUTH.REGISTER)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post(API_PATHS.AUTH.LOGIN)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_PATHS.AUTH.PROFILE)
  getProfile(@CurrentUser() user) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(API_PATHS.AUTH.ME)
  getMe(@CurrentUser() user) {
    return this.authService.getProfile(user.id);
  }

  // Example of role-based endpoint
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(API_PATHS.AUTH.ADMIN)
  adminOnly() {
    return { message: 'This is an admin only route' };
  }

  // Example of multi-role endpoint
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LECTURER)
  @Get(API_PATHS.AUTH.STAFF)
  staffOnly() {
    return { message: 'This is for admin and lecturers only' };
  }
}
