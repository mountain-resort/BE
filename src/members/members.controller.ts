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
} from '../common/configs/cookie-options';
import { MembersService } from './members.service';
import { QueryStringDto } from './dto/query-string.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import createMemberToken from '../common/utils/create-member.token';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { TokenPayloadDto } from 'src/common/dto/token-payload.dto';
import { CreateMemberPipe } from './pipes/create-member.pipe';
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
      sortBy = 'createdAt',
      orderBy = 'desc',
    } = queryStringDto;
    const memberList = await this.membersService.getMemberList(
      page,
      pageSize,
      keyword,
      isDeleted,
      sortBy,
      orderBy,
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
  @UsePipes(CreateMemberPipe)
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
  async checkPassword(
    @User() user: TokenPayloadDto,
    @Body() data: { password: string },
    @Res() res: Response,
  ) {
    const memberId = user.id;
    const { password } = data;
    const isPasswordCorrect = await this.membersService.checkPassword(
      memberId,
      password,
    );
    return res.status(200).send({ isConfirmed: isPasswordCorrect });
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

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteMember(@Param('id') memberId: number, @Res() res: Response) {
    await this.membersService.deleteMember(memberId);
    res.status(204).send();
  }
}
