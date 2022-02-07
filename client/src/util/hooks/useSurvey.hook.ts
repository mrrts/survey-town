import { useMemo } from "react"
import { useAppSelector } from "../../store";
import { getSurveyById, getSurveyItemsBySurveyId } from "../../store/surveys/slice"
import { getUserHandles } from "../../store/users/slice";

export const useSurvey = (surveyId: string) => {
  const surveySelector = useMemo(() => getSurveyById(surveyId), [surveyId]);
  const surveyItemsSelector = useMemo(() => getSurveyItemsBySurveyId(surveyId), [surveyId]);

  const survey = useAppSelector(surveySelector);
  const surveyItems = useAppSelector(surveyItemsSelector);
  const userHandles = useAppSelector(getUserHandles);

  const authorHandle = userHandles[survey?.author]?.handle;
  const numberOfResponses = survey?.numberOfResponses || 0;

  return {
    survey,
    surveyItems,
    authorHandle,
    numberOfResponses
  };
}