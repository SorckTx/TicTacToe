import { Controller, Get, HttpCode } from '@nestjs/common';

import { HomeService } from '../services/home.service';

@Controller('/')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('/')
  @HttpCode(200)
  run() {
    return this.homeService.run();
  }
}
