import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma-client";
import { CreateDiningDto } from "./dto/create-dining.dto";
import { Prisma } from "@prisma/client";
import { WhereCondition } from "./dto/where-condition.dto";
@Injectable()
export class DiningRepository {
    constructor(private readonly prisma: PrismaService) {}      

    getCountDiningList(where: WhereCondition) {
        return this.prisma.dining.count({
            where,
        });
    }

    getDiningList(where: WhereCondition, orderBy: Prisma.DiningOrderByWithRelationInput[]) {
        return this.prisma.dining.findMany({
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                description: true,
                tradingHours: true,
                content: true,
                location: true,
                menuUrl: true,
                imageUrl: true,
                isDeleted: true,
            },
        });
    }

    getDiningById(diningId: number) {
        return this.prisma.dining.findUnique({
            where: { id: diningId },
            select: {
                id: true,
                name: true,
                description: true,
                tradingHours: true,
                content: true,
                location: true,
                menuUrl: true,
                imageUrl: true,
            },
        });
    }

    createDining(dining: Prisma.DiningCreateInput) {
        return this.prisma.dining.create({
            data: dining,
            select: {
                id: true,
                name: true,
                description: true,
                tradingHours: true,
                content: true,
                location: true,
                menuUrl: true,
                imageUrl: true,
                isDeleted: true,
            },  
        });
    }

    updateDining(diningId: number, dining: Prisma.DiningUpdateInput) {
        return this.prisma.dining.update({
            where: { id: diningId },
            data: dining,
            select: {
                id: true,
                name: true,
                description: true,
                tradingHours: true,
                content: true,
                location: true,
                menuUrl: true,
                imageUrl: true,
            },
        });
    }

    deleteDining(diningId: number) {
        return this.prisma.dining.update({
            where: { id: diningId },
            data: { isDeleted: true },
            select: {
                id: true,
                name: true,
                description: true,
                tradingHours: true,
                content: true,
                location: true,
                menuUrl: true,
                imageUrl: true,
            },
        });
    }
}