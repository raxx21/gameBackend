import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  async findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.gameService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateGameDto: CreateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.gameService.delete(id);
  }
}
