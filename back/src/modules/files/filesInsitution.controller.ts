import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesInstitutionService } from './filesInstitution.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Files Institution')
@Controller('files')
export class FilesInstitutionController {
  constructor(private readonly fileUploadService: FilesInstitutionService) {}

  @ApiBearerAuth()
  @Post('uploadInstitutionImages/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async uploadInstitutionImages(
    @Param('id') institutionId: string,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; banner?: Express.Multer.File[] },
  ) {
    const logoFile = files.logo?.[0];
    const bannerFile = files.banner?.[0];

    const parseFilePipe = new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 2000000,
          message: 'Supera el máximo permitido:  2 MB',
        }),
        new FileTypeValidator({
          fileType: /(.jpg|.png|.jpeg|.webp)/,
        }),
      ],
    });

    try {
      if (logoFile) {
        await parseFilePipe.transform(logoFile);
      }
      if (bannerFile) {
        await parseFilePipe.transform(bannerFile);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    if (!logoFile && !bannerFile) {
      throw new BadRequestException(
        'Debes proporcionar al menos un archivo de logo o banner.',
      );
    }

    return this.fileUploadService.uploadImages(
      logoFile,
      bannerFile,
      institutionId,
    );
  }
}
