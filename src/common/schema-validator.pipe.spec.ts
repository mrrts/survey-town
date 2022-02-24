import { SchemaValidatorPipe } from "./schema-validator.pipe";
import * as yup from 'yup';
import { createSurveyDtoSchema } from "../surveys/dto/create-survey.dto";
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";

describe('SchemaValidatorPipe', () => {
  let schema: yup.AnySchema;
  let pipe: SchemaValidatorPipe;

  beforeEach(async () => {
    schema = createSurveyDtoSchema;

    pipe = new SchemaValidatorPipe(schema);
  });

  it('allows a valid object', async () => {
    const value = {
      title: 'title123',
      description: 'desc123'
    };
    const result = await pipe.transform(value, undefined);
    expect(result).toBe(value);
  });

  it('throws on an invalid object', async () => {
    const value = {
      description: 'desc123'
    };
    await expect(
      () => pipe.transform(value, undefined)
    ).rejects.toThrowError(new BadRequestException('title is a required field'));
  });
});