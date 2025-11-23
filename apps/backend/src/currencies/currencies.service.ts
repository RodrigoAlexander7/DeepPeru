import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.currency.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getCurrencyMap() {
    const currencies = await this.findAll();
    const map: Record<string, number> = {};

    currencies.forEach((currency) => {
      map[currency.code] = currency.id;
    });

    return map;
  }
}
