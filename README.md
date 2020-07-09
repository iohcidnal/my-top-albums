## Getting Started

First, be sure you have MongoDB installed locally. Please see [MongoDB insallation guide.](https://docs.mongodb.com/manual/installation/)

You'll also need to register with Spotify to create your client ID. Please see [Create & manage your Spotify integrations dashboard.](https://developer.spotify.com/dashboard/login)

Then do the following steps:

1. Clone project: `git clone https://github.com/iohcidnal/my-top-albums.git`

2. Install dependencies: `npm install`

3. Create an `.env.local` in the root folder with the following items:

```
NEXT_PUBLIC_CLIENT_ID=your-spotify-client-id
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
NEXT_PUBLIC_DB_URL=mongodb://localhost:27017/
```

To set the `NEXT_PUBLIC_DB_URL`, run `mongo` in your terminal then copy and paste the value of the `connecting to:` key.

4. Run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. To run the test: `npm test`

## Tech Stack

- NextJS
- ReactJS
- MongoDB
- Bulma
- Jest
- React Testing Library
