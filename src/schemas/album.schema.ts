import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Artist } from './artist.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Artist',
  })
  artist: Artist;

  @Prop({ required: true })
  nameAlbum: string;

  @Prop({ required: true })
  datetime: number;

  @Prop()
  image: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
