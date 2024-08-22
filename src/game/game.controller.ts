import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
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
  async findAll(@Query() query: any) {
    if (query.filters && query.filters.name && query.filters.name.$in) {
      query.filters.name.$in = query.filters.name.$in.split(',').map(value => value.trim());
    }
    if (query.filters) {
      for (const field in query.filters) {  
        if (query.filters[field] && query.filters[field].$in) {
          query.filters[field].$in = query.filters[field].$in.split(',').map(value => value.trim());
        }
        if (query.filters[field] && query.filters[field].$notIn) {
          query.filters[field].$notIn = query.filters[field].$notIn.split(',').map(value => value.trim());
        }
        if (query.filters[field] && query.filters[field].$between) {
          query.filters[field].$between = query.filters[field].$between.split(',').map(value => value.trim());
        }
      }
    }
    return this.gameService.findAll(query);
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
