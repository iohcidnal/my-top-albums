import mongoose from 'mongoose';

const topAlbumSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    albums: [{}],
  },
  { timestamps: true }
);

export default mongoose.models && mongoose.models.TopAlbum
  ? mongoose.models.TopAlbum
  : mongoose.model('TopAlbum', topAlbumSchema);
