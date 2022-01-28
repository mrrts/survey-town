import { BREED } from "../entities/cat.schema";

export class CreateCatDto {
  breed: BREED;
  name: string;
  dob: Date;
  mixof?: [string];
}
