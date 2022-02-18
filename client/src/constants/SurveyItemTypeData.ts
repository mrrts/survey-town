import { faAlignLeft, faCheckSquare, faCommentAlt, faDotCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { SurveyItemType } from "./SurveyItemType.enum";
import * as yup from 'yup';
import React from "react";
import { ContentInterludeFields } from "../components/surveys/survey-items/ContentInterludeFields";
import { FreeResponseFields } from "../components/surveys/survey-items/FreeResponseFields";
import { ItemWithChoicesFields } from "../components/surveys/survey-items/ItemWithChoicesFields";
import { TakeContentInterlude } from "../components/surveys/take-survey/TakeContentInterlude";
import { TakeFreeResponse } from "../components/surveys/take-survey/TakeFreeResponse";
import { TakeMultipleChoice } from "../components/surveys/take-survey/TakeMultipleChoice";
import { TakeMultipleSelect } from "../components/surveys/take-survey/TakeMultipleSelect";
import { SurveyResponseType } from "../entities/survey-response.model";

export interface ISurveyItemData {
  icon: IconDefinition;
  label: string;
  description: string;
  schema: yup.AnyObjectSchema;
  takeSchema: yup.AnyObjectSchema;
  takeDefaultValues: { [x: string]: any };
  fieldsComponent: React.FunctionComponent<any>,
  takeSurveyComponent: React.FunctionComponent<any>,
  responseType?: SurveyResponseType | null;
}

export const SurveyItemTypeData: Record<SurveyItemType, ISurveyItemData> = {
  [SurveyItemType.CONTENT_INTERLUDE]: {
    icon: faAlignLeft,
    label: 'Content Interlude',
    description: 'Extra content between questions that doesn\'t require response',
    schema: yup.object({
      content: yup.string().required()
    }).required(),
    takeSchema: yup.object({}),
    takeDefaultValues: {},
    fieldsComponent: ContentInterludeFields,
    takeSurveyComponent: TakeContentInterlude,
  },
  [SurveyItemType.FREE_RESPONSE]: {
    icon: faCommentAlt,
    label: 'Free Response Question',
    description: 'User can type out a freeform response',
    schema: yup.object({
      prompt: yup.string().required()
    }).required(),
    takeSchema: yup.object({
      freeResponse: yup.string()
    }),
    takeDefaultValues: { freeResponse: '' },
    fieldsComponent: FreeResponseFields,
    takeSurveyComponent: TakeFreeResponse,
    responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE
  },
  [SurveyItemType.MULTIPLE_CHOICE]: {
    icon: faDotCircle,
    label: 'Multiple Choice Question',
    description: 'User can select only one of a list of options',
    schema: yup.object({
      prompt: yup.string().required(),
      choices: yup.array().of(yup.string().required('choices must not be empty')).required()
    }).required(),
    takeSchema: yup.object({
      selection: yup.string().required()
    }),
    takeDefaultValues: { selection: null },
    fieldsComponent: ItemWithChoicesFields,
    takeSurveyComponent: TakeMultipleChoice,
    responseType: SurveyResponseType.MULTIPLE_CHOICE_RESPONSE
  },
  [SurveyItemType.MULTIPLE_SELECT]: {
    icon: faCheckSquare,
    label: 'Multiple Select Question',
    description: 'User can make multiple selections from a list of options',
    schema: yup.object({
      prompt: yup.string().required(),
      choices: yup.array().of(yup.string().required('choices must not be empty')).required()
    }).required(),
    takeSchema: yup.object({
      selections: yup.array().of(yup.string())
    }),
    takeDefaultValues: { selections: [] },
    fieldsComponent: ItemWithChoicesFields,
    takeSurveyComponent: TakeMultipleSelect,
    responseType: SurveyResponseType.MULTIPLE_SELECT_RESPONSE
  }
};