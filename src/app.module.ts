import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artist/artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { AlbumsController } from './albums/albums.controller';
import { Album, AlbumSchema } from './schemas/album.schema';
import { TracksController } from './tracks/tracks.controller';
import { Track, TrackSchema } from './schemas/track.schema';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import {User, UserSchema} from "./schemas/user.schema";
import {UniqueUserEmailConstraint} from "./users/validators/unique-user-email.validator";
import {LocalStrategy} from "./auth/local.strategy";
import {PermitGuard} from "./auth/permit.guard";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/music'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    AppController,
    ArtistsController,
    AlbumsController,
    TracksController,
    UsersController,
  ],
  providers: [
    AppService,
    AuthService,
    UniqueUserEmailConstraint,
    LocalStrategy,
    PermitGuard,
  ],
})
export class AppModule {}
