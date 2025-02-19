import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Body,
  Patch,
  Delete,
  Param,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AuthGuard } from '@nestjs/passport';
import { QueryStringDto } from 'src/members/dto/query-string.dto';
import { TokenPayloadDto } from 'src/common/dto/token-payload.dto';
import { User } from 'src/common/decorators/user-decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import {
  cookieOptions,
  refreshCookieOptions,
} from 'src/common/configs/cookieOptions';
import createAdminToken from 'src/common/utils/create-admin.token';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('users')
  async getAdmins(@Query() queryStringDto: QueryStringDto) {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      isDeleted = null,
    } = queryStringDto;
    const adminList = await this.adminsService.getAdminList(
      page,
      pageSize,
      keyword,
      isDeleted,
    );
    return adminList;
  }

  @Get('me')
  @UseGuards(AuthGuard('admin-jwt'))
  async getAdmin(@User() user: TokenPayloadDto) {
    const adminId = user.id;
    const admin = await this.adminsService.getAdminById(adminId);
    return admin;
  }

  @Post('sign-up')
  async signUp(@Body() data: CreateAdminDto, @Res() res: Response) {
    const admin = await this.adminsService.createAdmin(data);

    const access_token = createAdminToken(admin, 'access');
    const refresh_token = createAdminToken(admin, 'refresh');

    this.adminsService.updateAdminRefreshToken(admin.id, refresh_token);

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, refreshCookieOptions);

    res.status(200).send();
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInDto, @Res() res: Response) {
    const { email, password } = data;
    const admin = await this.adminsService.signIn(email, password);

    const access_token = createAdminToken(admin, 'access');
    const refresh_token = createAdminToken(admin, 'refresh');

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, refreshCookieOptions);

    res.status(200).send();
  }

  @Post('password/check')
  @UseGuards(AuthGuard('admin-jwt'))
  async checkPassword(
    @User() user: TokenPayloadDto,
    @Body() data: { password: string },
    @Res() res: Response,
  ) {
    const adminId = user.id;
    const { password } = data;
    const isPasswordCorrect = await this.adminsService.checkPassword(
      adminId,
      password,
    );
    return res.status(200).send({ isConfirmed: isPasswordCorrect });
  }

  @Patch('me')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateAdmin(
    @User() user: TokenPayloadDto,
    @Body() data: UpdateAdminDto,
  ) {
    const adminId = user.id;
    const admin = await this.adminsService.updateAdmin(adminId, data);
    return admin;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async updateAdminById(
    @User() user: TokenPayloadDto,
    @Param('id') adminId: number,
    @Body() data: UpdateAdminDto,
  ) {
    if (user.authority !== 'MANAGER' || !user.authority) {
      throw new ForbiddenException(
        'You are not authorized to update this admin',
      );
    }
    const admin = await this.adminsService.updateAdmin(adminId, data);
    return admin;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('admin-jwt'))
  async deleteAdmin(
    @User() user: TokenPayloadDto,
    @Param('id') adminId: number,
    @Res() res: Response,
  ) {
    if (user.authority !== 'MANAGER' || !user.authority) {
      throw new ForbiddenException(
        'You are not authorized to delete this admin',
      );
    }
    await this.adminsService.deleteAdmin(adminId);
    return res.status(204).send();
  }
}
