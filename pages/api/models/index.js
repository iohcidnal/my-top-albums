import mongoose from 'mongoose';
import TopAlbum from './top-album.model';

export function connectDb() {
  return mongoose.connect(
    process.env.NEXT_PUBLIC_DB_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    err => {
      if (err) console.log(err);
    }
  );
}

export const models = { TopAlbum };
