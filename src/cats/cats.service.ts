import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './entities/cat.entity';
import { Model, Document, UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<typeof Cat & Document>
  ) {}

  create(createCatDto: CreateCatDto) {
    const newCat = new this.catModel(createCatDto);
    return newCat.save();
  }

  findAll() {
    return this.catModel.find();
  }

  findOne(id: string) {
    return this.catModel.findOne({ uuid: id });
  }

  update(id: string, updateCatDto: UpdateCatDto) {
    return this.catModel.updateOne({ uuid: id }, updateCatDto)
      .exec()
      .then((result: UpdateWriteOpResult) => this.catModel.findOne({ uuid: id }));
  }

  remove(id: string) {
    return this.catModel.deleteOne({ uuid: id });
  }
}
