import { Schema, SchemaOptions, Model, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum SurveyItemType {
  CONTENT_INTERLUDE = 'CONTENT_INTERLUDE',
  FREE_RESPONSE = 'FREE_RESPONSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT'
}

// Different item types with own fields are stored in same collection,
// and type is signaled by the configured discriminatorKey: 'itemType'
const options: SchemaOptions = {
  collection: 'surveyItems',
  discriminatorKey: 'itemType'
};

export interface ISurveyItem {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  content?: string;
  prompt?: string;
  choices?: string[];
}

// Base SurveyItem schema for polymorphic collection.
export const surveyItemSchema = new Schema<ISurveyItem>({
  uuid: { type: String, default: () => uuidv4(), index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  author: String
}, options);

export const contentInterludeItemSchema = new Schema({
  content: String
}, options);

export const freeResponseItemSchema = new Schema({
  prompt: String
}, options);

export const multipleChoiceItemSchema = new Schema({
  prompt: String,
  choices: [String]
}, options);

export const multipleSelectItemSchema = new Schema({
  prompt: String,
  choices: [String]
}, options);

// Base model for polymorphic collection
export const SurveyItem: Model<ISurveyItem> = model('SurveyItem', surveyItemSchema);

// These models "extend" the base SurveyItem model
export const ContentInterludeItem: Model<ISurveyItem> = SurveyItem.discriminator(SurveyItemType.CONTENT_INTERLUDE, contentInterludeItemSchema);

export const FreeResponseItem: Model<ISurveyItem> = SurveyItem.discriminator(SurveyItemType.FREE_RESPONSE, freeResponseItemSchema);

export const MultipleChoiceItem: Model<ISurveyItem> = SurveyItem.discriminator(SurveyItemType.MULTIPLE_CHOICE, multipleChoiceItemSchema);

export const MultipleSelectItem: Model<ISurveyItem> = SurveyItem.discriminator(SurveyItemType.MULTIPLE_SELECT, multipleSelectItemSchema);

export type SurveyItemDocument = ISurveyItem & Document;