import { Schema, SchemaOptions, Model, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const options: SchemaOptions = {
  collection: 'surveys',
};

export interface ISurvey {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  title: string;
  description: string;
  responsesPublic: boolean;
  surveyItems: string[];
}

export const surveySchema = new Schema(
  {
    uuid: {
      type: String,
      default: () => uuidv4(),
      index: true,
      required: true,
      unique: true,
    },
    createdAt: { type: Date, index: true, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
    author: { type: String, index: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    responsesPublic: { type: Boolean, required: true, default: () => true },
    surveyItems: { type: [String], required: true, default: () => [] },
  },
  options,
);

export const Survey: Model<ISurvey> = model('Survey', surveySchema);

export type SurveyDocument = ISurvey & Document;
