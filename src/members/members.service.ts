import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
    isDeleted: string,
  ) {
    const where: WhereCondition = this.getWhereCondition(keyword, isDeleted);
    const [memberList, totalCount] = await Promise.all([
      this.membersRepository.getMemberList(where, page, pageSize),
      this.membersRepository.getCountMemberList(where),
    ]);

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
    return member;
  }

  async checkPassword(memberId: number, password: string) {
    const member = await this.membersRepository.getMemberById(memberId);
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    const isPasswordCorrect: boolean = await bcrypt.compare(
      password,
      member.encryptedPassword,
    );
    return isPasswordCorrect;
  }

  async createMember(member: CreateMemberDto) {
    const encryptedPassword: string = await bcrypt.hash(
      member.encryptedPassword,
      10,
    );
    return this.membersRepository.createMember({
      ...member,
      encryptedPassword,
    });
  }

  async updateMember(memberId: number, member: UpdateMemberDto) {
    try {
      const updatedMember = await this.membersRepository.updateMember(
        memberId,
        member,
      );
      return updatedMember;
    } catch (error) {
      throw new BadRequestException('Failed to update member');
    }
  }

  async deleteMember(memberId: number) {
    try {
      const deletedMember = await this.membersRepository.deleteMember(memberId);
      return deletedMember;
    } catch (error) {
      throw new BadRequestException('Failed to delete member');
    }
  }

  private getWhereCondition(keyword: string, isDeleted: string) {
    if (isDeleted === 'null') {
      return {
        OR: [
          { firstName: { contains: keyword } },
          { lastName: { contains: keyword } },
          { email: { contains: keyword } },
        ],
      };
    } else {
      return {
        isDeleted: isDeleted === 'true' ? true : false,
        OR: [
          { firstName: { contains: keyword } },
          { lastName: { contains: keyword } },
          { email: { contains: keyword } },
        ],
      };
    }
  }
}
