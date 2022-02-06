import { useMemo } from "react"
import { useAppSelector } from "../../store";
import { getSurveyById, getSurveyItemsBySurveyId } from "../../store/surveys/slice"

export const useSurvey = (surveyId: string) => {
  const surveySelector = useMemo(() => getSurveyById(surveyId), [surveyId]);
  const surveyItemsSelector = useMemo(() => getSurveyItemsBySurveyId(surveyId), [surveyId]);

  const survey = useAppSelector(surveySelector);
  const surveyItems = useAppSelector(surveyItemsSelector);

  return {
    survey,
    surveyItems
  };
}