import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
  run() {
    return { status: 'Welcome to Shakers Skeleton NestJS 🚀' };
  }
}
