import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAll(@Query('artist') artistId: string) {
    const filter: Record<string, unknown> = {};

    if (artistId) {
      filter.artist = artistId;
    }

    const albums = await this.albumModel.find(filter).sort({ datetime: -1 });

    return albums;
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById({ _id: id });
    console.log(album);
    if (!album) {
      throw new NotFoundException(`Album with id ${id}`);
    }
    return album;
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const album = await this.albumModel.findById({ _id: id });
    if (!album) {
      throw new NotFoundException(`Album with id ${id}`);
    }

    await this.albumModel.deleteOne({ _id: id });

    return album;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async create(
    @Body() albumData: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const album = await this.albumModel.create({
      artist: albumData.artist,
      nameAlbum: albumData.nameAlbum,
      datetime: albumData.datetime,
      image: file ? 'images/' + file.filename : null,
    });
    return album;
  }
}
