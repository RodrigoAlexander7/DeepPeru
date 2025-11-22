import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import type { AuthRequest } from '@/auth/interfaces/auth-request.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile of the authenticated user. Requires a valid JWT token in the Authorization header or access_token cookie.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or missing authentication token',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getProfile(@Request() req: AuthRequest): Promise<UserResponseDto> {
    try {
      return await this.usersService.findOne(req.user.userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('User not found');
      }
      throw error;
    }
  }
}
