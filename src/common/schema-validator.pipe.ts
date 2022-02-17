import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import * as yup from 'yup';

@Injectable()
export class SchemaValidatorPipe implements PipeTransform<any> {
  private schema: yup.AnySchema;

  constructor(schema: yup.AnySchema) {
    this.schema = schema;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const validatedValue = await this.schema.validate(value)
      .catch((validationError: yup.ValidationError) => {
        throw new BadRequestException(validationError.message);
      });

    return validatedValue;
  }
}