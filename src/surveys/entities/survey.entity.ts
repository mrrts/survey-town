import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const options: mongoose.SchemaOptions = {
  collection: 'surveys'
};

export const surveySchema = new mongoose.Schema({
  uuid: { type: String, default: () => uuidv4(), index: true },
  createdAt: { type: Date, index: true, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  author: { type: String, index: true },
  title: String,
  description: String,
  responsesPublic: Boolean,
  surveyItems: [String]
}, options);

export const Survey = mongoose.model('Survey', surveySchema);