import { Document, Schema, model, Model, SchemaOptions } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export enum ResponseType {
  FREE_RESPONSE = 'FREE_RESPONSE_RESPONSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE_RESPONSE',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT_RESPONSE'
}

export interface IResponse {
  uuid: string;
  survey: string;
  surveyItem: string;
  responseType: ResponseType;
  user: string;
  createdAt: Date;
  selection?: string;
  selections?: string[];
  freeResponse?: string;
}

const options: SchemaOptions = {
  collection: 'surveyResponses',
  discriminatorKey: 'responseType'
}

// base shared schema for all polymorphic response types
export const responseSchema = new Schema({
  uuid: { type: String, required: true, index: true, default: uuidv4 },
  survey: { type: String, required: true, index: true },
  surveyItem: { type: String, required: true, index: true },
  responseType: { type: String, required: true },
  user: { type: String, required: true, index: true },
  createdAt: { type: Date, required: true, default: Date.now }
}, options);

export const freeResponseSchema = new Schema({
  freeResponse: { type: String, required: true }
}, options);

export const multipleChoiceResponseSchema = new Schema({
  selection: { type: String, required: true }
}, options);

export const multipleSelectResponseSchema = new Schema({
  selections: { type: [String], required: true }
}, options);

// base model for polymorphic collection
export const Response: Model<IResponse> = model('Response', responseSchema);

export const FreeResponse: Model<IResponse> = Response.discriminator(
  ResponseType.FREE_RESPONSE,
  freeResponseSchema
);

export const MultipleChoiceResponse: Model<IResponse> = Response.discriminator(
  ResponseType.MULTIPLE_CHOICE,
  multipleChoiceResponseSchema
);

export const MultipleSelectResponse: Model<IResponse> = Response.discriminator(
  ResponseType.MULTIPLE_SELECT,
  multipleSelectResponseSchema
);

export type ResponseDocument = IResponse & Document;
