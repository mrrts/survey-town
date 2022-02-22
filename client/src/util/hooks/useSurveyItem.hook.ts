import { useMemo } from "react"
import { SurveyItemTypeData } from "../../constants/SurveyItemTypeData";
import { useAppSelector } from "../../store";
import { getUser } from "../../store/auth/selectors";
import { getResponsesForSurveyItem, getSurveyItemById } from "../../store/surveys/selectors"

export const useSurveyItem = (surveyItemId: string) => {
  const selector = useMemo(() => getSurveyItemById(surveyItemId), [surveyItemId]);
  const surveyItem = useAppSelector(selector);
  const itemType = surveyItem?.itemType;
  const surveyItemTypeData = SurveyItemTypeData[itemType];

  const responsesSelector = useMemo(() => getResponsesForSurveyItem(surveyItemId), [surveyItemId]);
  const responses = useAppSelector(responsesSelector);

  const user = useAppSelector(getUser);

  const isOwner = !!user && user.uuid === surveyItem?.author;
  
  return {
    surveyItem,
    isOwner,
    itemType,
    surveyItemTypeData,
    responses
  };
}