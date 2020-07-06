import { connectDb, models } from '../models';

let db;

export default async function (req, res) {
  if (!db) {
    db = await connectDb();
  }

  try {
    const topAlbum = await models.TopAlbum.findOne({ userId: req.query.id });
    switch (req.method) {
      case 'GET': {
        const result = topAlbum ? topAlbum.albums : [];
        return res.status(200).json(result);
      }
      case 'POST': {
        const payload = JSON.parse(req.body);
        if (!topAlbum) {
          const doc = new models.TopAlbum({
            userId: req.query.id,
            albums: [payload],
          });
          doc.save();
        } else {
          topAlbum.albums.push(payload);
          topAlbum.save();
        }
        return res.status(201).json(payload);
      }
      case 'PUT': {
        const payload = JSON.parse(req.body);
        topAlbum.albums = payload;
        topAlbum.save();
        return res.status(200).send({ result: 'Albums updated successfully' });
      }
      case 'DELETE': {
        const payload = JSON.parse(req.body);
        const albums = topAlbum.albums.filter(a => a.id !== payload.id);
        topAlbum.albums = albums;
        topAlbum.save();
        return res.status(200).send({ result: `${payload.id} deleted successfully` });
      }
      default:
        return res.status(405).send('Method is not allowed.');
    }
  } catch (error) {
    console.log(error);
    db.connection.close();
  }
}
