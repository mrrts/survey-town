import { faAlignLeft, faCheckSquare, faCommentAlt, faDotCircle, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { SurveyItemType } from "./SurveyItemType.enum";

export interface ISurveyItemData {
  icon: IconDefinition;
  label: string;
  description: string;
}

export const SurveyItemTypeData: Record<SurveyItemType, ISurveyItemData> = {
  [SurveyItemType.CONTENT_INTERLUDE]: {
    icon: faAlignLeft,
    label: 'Content Interlude',
    description: 'Extra content between questions that doesn\'t require response'
  },
  [SurveyItemType.FREE_RESPONSE]: {
    icon: faCommentAlt,
    label: 'Free Response Question',
    description: 'User can type out a freeform response'
  },
  [SurveyItemType.MULTIPLE_CHOICE]: {
    icon: faDotCircle,
    label: 'Multiple Choice Question',
    description: 'User can select only one of a list of options'
  },
  [SurveyItemType.MULTIPLE_SELECT]: {
    icon: faCheckSquare,
    label: 'Multiple Select Question',
    description: 'User can make multiple selections from a list of options'
  }
};