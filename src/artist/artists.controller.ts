import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {TokenAuthGuard} from "../auth/token-auth.guard";
import {PermitGuard} from "../auth/permit.guard";

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById({ _id: id });
    console.log(artist);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id}`);
    }
    return artist;
  }

  @UseGuards(TokenAuthGuard, new PermitGuard(['admin']))
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById({ _id: id });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id}`);
    }

    await this.artistModel.deleteOne({ _id: id });

    return artist;
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async create(
    @Body() categoryDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const artist = await this.artistModel.create({
      name: categoryDto.name,
      information: categoryDto.information,
      image: file ? 'images/' + file.filename : null,
    });
    return artist;
  }
}
