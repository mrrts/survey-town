import { RouteComponentProps } from "@reach/router";
import { FC } from "react";
import { Survey } from "./Survey";

export interface ISurveyRouteProps extends RouteComponentProps {
  surveyId?: string;
}

export const SurveyRoute: FC<ISurveyRouteProps> = ({ surveyId }) => {
  return (
    <div className='survey-route-container'>
      <h3>Survey Route for {surveyId}</h3>
    </div>
  );
}