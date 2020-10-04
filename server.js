const app = require('express')();
const cors = require('cors');
const { updateSteamCollection, findGames } = require('./src/business/steamGame');
const PORT = 5000;
const routePrefix = '/v1/api';

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get(`${routePrefix}/healthCheck`, (req, res) => {
  res.status(200).send('Healthy!');
});

app.get(`${routePrefix}/updateSteamCollection`, async (req, res) => {
  const response = await updateSteamCollection();
  res.status(response.status).json(response.data);
});

app.get(`${routePrefix}/findGames`, async (req, res) => {
  const response = await findGames(req.query.appName, req.query.perPage, req.query.page);
  res.status(response.status).json(response.data);
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})