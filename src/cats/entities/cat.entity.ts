import * as mongoose from 'mongoose';
import { catSchema, BREED, tabbySchema } from './cat.schema';

export const Cat = mongoose.model('Cat', catSchema);

export const Tabby = Cat.discriminator(BREED.TABBY, tabbySchema);