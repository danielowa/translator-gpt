import { IsString } from 'class-validator';

export class TranslateDto {
  @IsString()
  readonly input_message: string;

  @IsString()
  readonly input_language: string;

  @IsString()
  readonly output_language: string;
}
