import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum SurveyItemType {
  CONTENT_INTERLUDE = 'CONTENT_INTERLUDE',
  FREE_RESPONSE = 'FREE_RESPONSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT'
}

const options: mongoose.SchemaOptions = {
  collection: 'surveyItems',
  discriminatorKey: 'itemType'
};

// Base SurveyItem schema for polymorphic collection
const surveyItemSchema = new mongoose.Schema({
  uuid: { type: String, default: () => uuidv4(), index: true },
  author: String
}, options);

export const contentInterludeItemSchema = new mongoose.Schema({
  content: String
}, options);

export const freeResponseItemSchema = new mongoose.Schema({
  prompt: String
}, options);

export const multipleChoiceItemSchema = new mongoose.Schema({
  prompt: String,
  choices: [String]
}, options);

export const multipleSelectItemSchema = new mongoose.Schema({
  prompt: String,
  choices: [String]
}, options);

const SurveyItem = mongoose.model('SurveyItem', surveyItemSchema);

export const ContentInterludeItem = SurveyItem.discriminator(SurveyItemType.CONTENT_INTERLUDE, contentInterludeItemSchema);

export const FreeResponseItem = SurveyItem.discriminator(SurveyItemType.FREE_RESPONSE, freeResponseItemSchema);

export const MultipleChoiceItem = SurveyItem.discriminator(SurveyItemType.MULTIPLE_CHOICE, multipleChoiceItemSchema);

export const MultipleSelectItem = SurveyItem.discriminator(SurveyItemType.MULTIPLE_SELECT, multipleSelectItemSchema);
