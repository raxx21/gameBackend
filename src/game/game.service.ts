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

  async findAll(query: any): Promise<Game[]> {
    const filters = this.buildFilters(query.filters || {});
    const pagination = this.buildPagination(query.pagination || {});
    console.log(pagination);

    return this.gameModel
      .find(filters)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .exec();
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

  private buildFilters(filters: any): any {
    const mongooseFilters = {};
    
    Object.keys(filters).forEach(field => {
      const fieldFilters = filters[field];
      Object.keys(fieldFilters).forEach(operator => {
        const value = fieldFilters[operator];
        const mongooseOperator = this.mapOperatorToMongoose(operator);
        console.log(operator);
        if (operator == '$eqi') {
          mongooseFilters[field] = { $regex: new RegExp(`^${value}$`, 'i') };
        } else if (operator == '$containsi') {
          mongooseFilters[field] = { $regex: new RegExp(value, 'i') };
        } else if (operator == '$notContains') {
          mongooseFilters[field] = { $not: { $regex: new RegExp(value) } };
        } else if (operator == '$notContainsi') {
          mongooseFilters[field] = { $not: new RegExp(value, 'i') };
        } else if (operator == '$null') {
          mongooseFilters[field] = null;
        } else if (operator == '$notNull') {
          mongooseFilters[field] = { $ne: null };
        } else if (operator == '$between') {
          mongooseFilters[field] = {
            $gte: value[0],
            $lte: value[1],
          };
          console.log(mongooseFilters[field]);
        } else if (operator == '$startsWith') {
          mongooseFilters[field] = { $regex: new RegExp(`^${value}`) };
        } else if (operator == '$startsWithi') {
          mongooseFilters[field] = { $regex: new RegExp(`^${value}`, 'i'), };
        } else if (operator == '$endsWith') {
          mongooseFilters[field] = { $regex: new RegExp(`${value}$`) };
        } else if (operator == '$endsWithi') {
          mongooseFilters[field] = { $regex: new RegExp(`${value}$`, 'i') };
        } else if (mongooseOperator) {
          mongooseFilters[field] = { ...mongooseFilters[field], [mongooseOperator]: value };
        }
      });
    });

    return mongooseFilters;
  }

  private mapOperatorToMongoose(operator: string): any {
    const operatorMap = {
      $eq: '$eq',
      $eqi: '$regex',
      $ne: '$ne',
      $nei: '$not',
      $lt: '$lt',
      $lte: '$lte',
      $gt: '$gt',
      $gte: '$gte',
      $in: '$in',
      $notIn: '$nin',
      $contains: '$regex',
      $notContains: '$not',
      $containsi: '$regex',
      $notContainsi: '$not',
      $null: 'null',
      $notNull: { $ne: null },
      $between: '$gte',
      $startsWith: '$regex',
      $startsWithi: '$regex',
      $endsWith: '$regex',
      $endsWithi: '$regex',
      $or: '$or',
      $and: '$and',
      $not: '$not',
    };
  
    return operatorMap[operator] || null;
  }  

  private buildPagination(pagination: any): any {
    console.log(pagination);
    const page = parseInt(pagination.page, 10) || 1;
    const pageSize = parseInt(pagination.pageSize, 10) || 10;
    
    return {
      skip: (page - 1),
      limit: pageSize,
    };
  }
}
