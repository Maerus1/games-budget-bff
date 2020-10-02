const app = require('express')();
const { updateSteamCollection, findGames } = require('./src/business/steamGame');
const PORT = 5000;
const routePrefix = '/v1/api';

app.get(`${routePrefix}/healthCheck`, (req, res) => {
  res.status(200).send('Healthy!');
});

app.get(`${routePrefix}/updateSteamCollection`, async (req, res) => {
  const response = await updateSteamCollection();
  res.status(response.status).json(response.data);
});

app.get(`${routePrefix}/findGames`, async (req, res) => {
  const response = await findGames(req.query.appName);
  res.status(response.status).json(response.data);
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})