import { faAlignLeft, faCheckSquare, faCommentAlt, faDotCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { SurveyItemType } from "./SurveyItemType.enum";
import * as yup from 'yup';
import React from "react";
import { ContentInterludeFields } from "../components/surveys/survey-items/ContentInterludeFields";
import { FreeResponseFields } from "../components/surveys/survey-items/FreeResponseFields";
import { ItemWithChoicesFields } from "../components/surveys/survey-items/ItemWithChoicesFields";

export interface ISurveyItemData {
  icon: IconDefinition;
  label: string;
  description: string;
  schema: yup.AnyObjectSchema;
  fieldsComponent: React.FunctionComponent<any>
}

export const SurveyItemTypeData: Record<SurveyItemType, ISurveyItemData> = {
  [SurveyItemType.CONTENT_INTERLUDE]: {
    icon: faAlignLeft,
    label: 'Content Interlude',
    description: 'Extra content between questions that doesn\'t require response',
    schema: yup.object().shape({
      content: yup.string().required()
    }).required(),
    fieldsComponent: ContentInterludeFields
  },
  [SurveyItemType.FREE_RESPONSE]: {
    icon: faCommentAlt,
    label: 'Free Response Question',
    description: 'User can type out a freeform response',
    schema: yup.object().shape({
      prompt: yup.string().required()
    }).required(),
    fieldsComponent: FreeResponseFields
  },
  [SurveyItemType.MULTIPLE_CHOICE]: {
    icon: faDotCircle,
    label: 'Multiple Choice Question',
    description: 'User can select only one of a list of options',
    schema: yup.object().shape({
      prompt: yup.string().required(),
      choices: yup.array().of(yup.string().required('choices must not be empty')).required()
    }).required(),
    fieldsComponent: ItemWithChoicesFields
  },
  [SurveyItemType.MULTIPLE_SELECT]: {
    icon: faCheckSquare,
    label: 'Multiple Select Question',
    description: 'User can make multiple selections from a list of options',
    schema: yup.object().shape({
      prompt: yup.string().required(),
      choices: yup.array().of(yup.string().required('choices must not be empty')).required()
    }).required(),
    fieldsComponent: ItemWithChoicesFields
  }
};