import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { SubmitQuestionnaireDto } from './dto/submit-questionnaire.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/v1/questionnaire')
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async submitAnswers(@Req() req: Request, @Body() dto: SubmitQuestionnaireDto) {
    const userId = (req.user as any)?.sub;
    const result = await this.questionnaireService.submitAnswers(userId, dto);

    return {
      success: true,
      data: result,
      message: 'Questionário submetido com sucesso',
    };
  }

  @Get('my-assessment')
  @UseGuards(JwtAuthGuard)
  async getMyAssessment(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    const questionnaire = await this.questionnaireService.getQuestionnaire(userId);

    if (!questionnaire) {
      return {
        success: true,
        data: null,
        message: 'Nenhum questionário encontrado. Complete o questionário de comportamento.',
      };
    }

    return {
      success: true,
      data: questionnaire,
    };
  }
}
