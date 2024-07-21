import { Body, Injectable, Post } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';
import {
  OpenAIClient,
  AzureKeyCredential,
  GetChatCompletionsOptions,
  ChatRequestMessageUnion,
} from '@azure/openai';

@Injectable()
export class TranslatorService {
  @Post()
  async translateText(@Body() translateDto: TranslateDto): Promise<string> {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const key = process.env.AZURE_OPENAI_KEY;
    if (endpoint === undefined) {
      throw new Error('AZURE_OPENAI_ENDPOINT is not defined');
    }
    if (key === undefined) {
      throw new Error('AZURE_OPENAI_KEY is not defined');
    }

    const credentials = new AzureKeyCredential(key);
    const client = new OpenAIClient(endpoint, credentials);

    const deplyoment_name = 'gpt-4o';
    const messages: ChatRequestMessageUnion[] = [
      {
        role: 'system',
        content: 'Act as a translator.',
      },
      {
        role: 'user',
        content: `Translate from ${translateDto.input_language} to ${translateDto.output_language}: ${translateDto.input_message}`,
      },
    ];

    const options: GetChatCompletionsOptions = {
      maxTokens: 512,
      temperature: 0,
      topP: 1,
      presencePenalty: 0.0,
      frequencyPenalty: 0.0,
      n: 1,
    };
    const events = await client.streamChatCompletions(deplyoment_name, messages, options);
    let result = '';

    for await (const event of events) {
      for (const choice of event.choices) {
        if (choice.delta?.content === undefined) {
          continue;
        }
        console.log(choice.delta?.content);
        result += choice.delta?.content;
      }
    }

    return result;
  }
}
