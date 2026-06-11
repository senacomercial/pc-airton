import { IsArray, IsString, IsNotEmpty, ValidateNested, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  answer: number; // 1 = strongly disagree, 5 = strongly agree
}

export class SubmitQuestionnaireDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  answers: QuestionAnswerDto[];
}
