import { useMemo } from "react";
import { useAppSelector } from "../../store"
import { getUser } from "../../store/auth/selectors"
import { getSurveyById } from "../../store/surveys/selectors";

export const useIsSurveyOwner = (surveyId: string): boolean => {
  const user = useAppSelector(getUser);
  const surveySelector = useMemo(() => {
    return getSurveyById(surveyId);
  }, [surveyId]);
  const survey = useAppSelector(surveySelector);

  return !!user && user.uuid === survey?.author;
}