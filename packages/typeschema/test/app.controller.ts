import { Body, Controller, Post } from '@nestjs/common';
import {
  AjvDto,
  ArktypeDto,
  IoTsDTO,
  JoiDto,
  OwDto,
  RuntypesDto,
  SuperstructDto,
  TypeboxDto,
  ValibotDto,
  YupDto,
  ZodDto,
} from './models';

@Controller()
export class AppController {
  @Post('ajv')
  ajvTest(@Body() { data }: AjvDto) {
    return data;
  }

  @Post('arktype')
  arktypeTest(@Body() { data }: ArktypeDto) {
    return data;
  }

  @Post('io-ts')
  ioTsTest(@Body() { data }: IoTsDTO) {
    return data;
  }

  @Post('joi')
  joiTest(@Body() { data }: JoiDto) {
    return data;
  }

  @Post('ow')
  owTest(@Body() { data }: OwDto) {
    return data;
  }

  @Post('runtypes')
  runtypesTest(@Body() { data }: RuntypesDto) {
    return data;
  }

  @Post('superstruct')
  superstructTest(@Body() { data }: SuperstructDto) {
    return data;
  }

  @Post('typebox')
  typeboxTest(@Body() { data }: TypeboxDto) {
    return data;
  }

  @Post('valibot')
  valibotTest(@Body() { data }: ValibotDto) {
    return data;
  }

  @Post('yup')
  yupTest(@Body() { data }: YupDto) {
    return data;
  }

  @Post('zod')
  zodTest(@Body() { data }: ZodDto) {
    return data;
  }
}
