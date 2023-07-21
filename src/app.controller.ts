import { Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { AuthGuard } from './auth/auth.guard';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log("teste")
    return this.appService.getHello();
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(new ParseFilePipe(
    {
    validators: [
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
    ],
  }
  ),) file: Express.Multer.File) {
    console.log("teste")
    if (!file.mimetype.includes('image')) {
      throw new Error('O arquivo enviado não é uma imagem.');
    }
    const uploadDir = './photos';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

    const fileName = `${new Date().getTime()}-${file.originalname}`;

    const filePath = `${uploadDir}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer);
    return { message: 'doença aleatoria', filePath };
    
  }

}
