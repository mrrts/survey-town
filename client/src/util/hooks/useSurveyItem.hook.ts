import { useMemo } from "react"
import { useAppSelector } from "../../store";
import { getUser } from "../../store/auth/selectors";
import { getSurveyItemById } from "../../store/surveys/selectors"

export const useSurveyItem = (surveyItemId: string) => {
  const selector = useMemo(() => getSurveyItemById(surveyItemId), [surveyItemId]);
  const surveyItem = useAppSelector(selector);

  const user = useAppSelector(getUser);

  const isOwner = !!user && user.uuid === surveyItem?.author;
  
  return { surveyItem, isOwner };
}