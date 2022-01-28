import * as mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export enum BREED {
  PERSIAN = 'PERSIAN',
  TABBY = 'TABBY',
  SIAMESE = 'SIAMESE'
}

const options: mongoose.SchemaOptions = { discriminatorKey: 'breed', collection: 'cats' };

export const catSchema = new mongoose.Schema({
  uuid: { type: String, index: true, default: () => uuidv4() },
  name: String,
  dob: Date
}, options);

// Breed subtype specific fields
export const tabbySchema = new mongoose.Schema({
  mixOf: [String]
}, options);
