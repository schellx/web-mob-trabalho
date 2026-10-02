import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('usuarios')
  findAll(){
    return [
      { id: 1, nome: 'João'},
      { id: 2, nome: 'Kas'}
    ];
  }


}
