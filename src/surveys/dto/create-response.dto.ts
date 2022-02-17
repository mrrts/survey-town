import { ResponseType } from '../entities/response.entity';
import * as yup from 'yup';
import { values } from 'lodash';

export class CreateResponseDto {
  responseType: ResponseType;
  selection?: string;
  selections?: string[];
  freeResponse?: string;
}

export const createResponseDtoSchema: yup.AnySchema = yup.object({
  responseType: yup.string().oneOf(values(ResponseType)).required(),
  selection: yup.string().when(['responseType'], {
    is: (responseType: ResponseType) => {
      return responseType === ResponseType.MULTIPLE_CHOICE_RESPONSE;
    },
    then: yup.string().required()
  }),
  selections: yup.array().of(yup.string()).when(['responseType'], {
    is: (responseType: ResponseType) => {
      return responseType === ResponseType.MULTIPLE_SELECT_RESPONSE;
    },
    then: yup.array().of(yup.string()).min(0).required()
  }),
  freeResponse: yup.string().when(['responseType'], {
    is: (responseType: ResponseType) => {
      return responseType === ResponseType.FREE_RESPONSE_RESPONSE;
    },
    then: yup.string().required()
  })
}).required();
