import { ResponseType } from "../entities/response.entity";

export class CreateResponseDto {
  responseType: ResponseType;
  selection?: string;
  selections?: string[];
  freeResponse?: string;
}