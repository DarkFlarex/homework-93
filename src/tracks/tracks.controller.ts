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
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTrackDto } from './create-tracks.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getAll(@Query('album') albumId: string) {
    const filter: Record<string, unknown> = {};

    if (albumId) {
      filter.album = albumId;
    }

    const tracks = await this.trackModel.find(filter).sort({ numberTrack: 1 });

    return tracks;
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    const track = await this.trackModel.findById({ _id: id });
    if (!track) {
      throw new NotFoundException(`Track with id ${id}`);
    }

    await this.trackModel.deleteOne({ _id: id });

    return track;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async create(
    @Body() trackData: CreateTrackDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const tracks = await this.trackModel
      .find({ album: trackData.album })
      .sort({ numberTrack: -1 });

    const numberTrack = tracks.length > 0 ? tracks[0].numberTrack + 1 : 1;

    const newTrack = await this.trackModel.create({
      artist: trackData.artist,
      album: trackData.album,
      nameTrack: trackData.nameTrack,
      duration: trackData.duration,
      numberTrack: numberTrack,
      image: file ? 'images/' + file.filename : null,
    });

    return newTrack;
  }
}
