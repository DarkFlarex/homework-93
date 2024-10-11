import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './album.schema';
import { Artist } from './artist.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Album',
  })
  album: Album;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Artist',
  })
  artist: Artist;

  @Prop({ required: true })
  nameTrack: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  numberTrack: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
