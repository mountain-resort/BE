import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MembersRepository } from './members.repository';
import { CreateMemberDto } from './dto/create.member';
import { UpdateMemberDto } from './dto/update.member';
import { WhereCondition } from './dto/whereCondition';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MembersRepository) {}

  async getMemberList(
    page: number,
    pageSize: number,
    keyword: string,
    isDeleted: string | null,
  ) {
    const where: WhereCondition = this.getWhereCondition(keyword, isDeleted);
    const [memberList, totalCount] = await Promise.all([
      this.membersRepository.getMemberList(where, page, pageSize),
      this.membersRepository.getCountMemberList(where),
    ]);

    // 페이지네이션 계산
    const hasNext = totalCount > page * pageSize;
    const totalPage = Math.ceil(totalCount / pageSize);
    const currentPage = page;

    return {
      hasNext,
      totalPage,
      currentPage,
      List: memberList,
    };
  }

  async getMemberById(id: number) {
    const member = await this.membersRepository.getMemberById(id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // 비밀번호와 리프레시 토큰 제외
    const { encryptedPassword, refreshToken, ...rest } = member;
    return rest;
  }

  async checkPassword(memberId: number, password: string) {
    const member = await this.membersRepository.getMemberById(memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // 비밀번호 검증
    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      member.encryptedPassword,
    );

    return isPasswordCorrect;
  }

  async checkRefreshToken(memberId: number, refreshToken: string) {
    const member = await this.membersRepository.getMemberById(memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // 리프레시 토큰 검증 반환환
    return member.refreshToken === refreshToken;
  }

  async createMember(member: CreateMemberDto) {
    const encryptedPassword: string = await bcrypt.hash(
      member.encryptedPassword,
      10,
    );

    const newMember = await this.membersRepository.createMember({
      ...member,
      encryptedPassword,
    });

    return newMember;
  }

  async signIn(email: string, password: string) {
    const member = await this.membersRepository.getMemberByEmail(email);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      member.encryptedPassword,
    );

    if (!isPasswordCorrect) {
      throw new UnprocessableEntityException('Invalid password');
    }

    const { encryptedPassword, refreshToken, ...rest } = member;
    return rest;
  }

  async updateMember(memberId: number, member: UpdateMemberDto) {
    try {
      const updatedMember = await this.membersRepository.updateMember(
        memberId,
        member,
      );
      return updatedMember;
    } catch (error) {
      // 데이터베이스에서 오류 발생 시 예외 발생
      throw new BadRequestException('Failed to update member');
    }
  }

  async deleteMember(memberId: number) {
    try {
      const deletedMember = await this.membersRepository.deleteMember(memberId);
      return deletedMember;
    } catch (error) {
      // 데이터베이스에서 오류 발생 시 예외 발생
      throw new BadRequestException('Failed to delete member');
    }
  }

  private getWhereCondition(keyword: string, isDeleted: string) {
    const OR = [
      { firstName: { contains: keyword } },
      { lastName: { contains: keyword } },
      { note: { contains: keyword } },
    ];

    if (isDeleted === 'null') {
      return {
        OR,
      };
    } else {
      return {
        isDeleted: isDeleted === 'true' ? true : false,
        OR,
      };
    }
  }
}
