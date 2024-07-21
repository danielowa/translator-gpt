import { Body, Controller, Post } from '@nestjs/common';
import { TranslatorService } from './translator.service';
import { TranslateDto } from './dto/translate.dto';

@Controller('translate')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) {}

  @Post()
  async translateText(@Body() translateDto: TranslateDto): Promise<string> {
    return this.translatorService.translateText(translateDto);
  }
}
