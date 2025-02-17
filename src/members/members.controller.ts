import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
  Patch,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import {
  cookieOptions,
  refreshCookieOptions,
} from '../common/configs/cookieOptions';
import { MembersService } from './members.service';
import { QueryStringDto } from './dto/queryString';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateMemberDto } from './dto/create.member';
import { UpdateMemberDto } from './dto/update.member';
import createMemberToken from '../common/utils/create.member.token';
import { Response } from 'express';
import { SignInDto } from './dto/signin';
import { TokenPayloadDto } from 'src/common/dto/tokenPayload';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getMembers(@Query() queryStringDto: QueryStringDto) {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      isDeleted = null,
    } = queryStringDto;
    const memberList = await this.membersService.getMemberList(
      page,
      pageSize,
      keyword,
      isDeleted,
    );
    return memberList;
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMember(@User() user: TokenPayloadDto) {
    const memberId = user.id;
    const member = await this.membersService.getMemberById(memberId);
    return member;
  }

  @Post('sign-up')
  async signUp(@Body() data: CreateMemberDto, @Res() res: Response) {
    const member = await this.membersService.createMember(data);

    const access_token = createMemberToken(member, 'access');
    const refresh_token = createMemberToken(member, 'refresh');

    this.membersService.updateMemberRefreshToken(member.id, refresh_token);

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, refreshCookieOptions);

    res.status(200).send();
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInDto, @Res() res: Response) {
    const { email, password } = data;
    const member = await this.membersService.signIn(email, password);

    const access_token = createMemberToken(member, 'access');
    const refresh_token = createMemberToken(member, 'refresh');

    res.cookie('access_token', access_token, cookieOptions);
    res.cookie('refresh_token', refresh_token, refreshCookieOptions);

    res.status(200).send();
  }

  @Post('password/check')
  @UseGuards(AuthGuard('jwt'))
  async checkPassword(@User() user: TokenPayloadDto, @Body() password: string) {
    const memberId = user.id;
    const isPasswordCorrect = await this.membersService.checkPassword(
      memberId,
      password,
    );
    return isPasswordCorrect;
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  async updateMember(
    @User() user: TokenPayloadDto,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const memberId = user.id;
    const member = await this.membersService.updateMember(
      memberId,
      updateMemberDto,
    );
    return member;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateMemberById(
    @Param('id') memberId: number,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const member = await this.membersService.updateMember(
      memberId,
      updateMemberDto,
    );
    return member;
  }
}
