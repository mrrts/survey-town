import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat } from './entities/cat.entity';
import { catSchema } from './entities/cat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: catSchema }])
  ],
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
