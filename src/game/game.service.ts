import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { CreateGameDto } from './game.dto';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  async findOne(id: number): Promise<Game> {
    return this.gameModel.findOne({ id }).exec();
  }

  async update(id: number, updateGameDto: CreateGameDto): Promise<Game> {
    return this.gameModel.findOneAndUpdate({ id }, updateGameDto, {
      new: true,
    }).exec();
  }

  async delete(id: number): Promise<Game> {
    return this.gameModel.findOneAndDelete({ id }).exec();
  }
}
