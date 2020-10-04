const fetch = require('node-fetch');
const { connect } = require('./../util/mongdb');
const mongoose = require('mongoose');
const { SteamGame } = require('./../models/SteamGame');
const steamGame = mongoose.model('SteamGame', SteamGame);

exports.updateSteamCollection = async () => {
  const url = 'mongodb://localhost:27017';
  try{
    await connect(url);

    const gamesResponse = await fetch('http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const games = await gamesResponse.json();

    const gameList = games.applist.apps;
    const deleteInstance = await steamGame.deleteMany({});
    const instance = await steamGame.insertMany(gameList);

    console.info('Deleted records: ', deleteInstance);
    console.info('Added Records: ', instance);

    mongoose.connection.close();

    return { status: 200, data: instance };
  } catch (error) {
    const errorMessage = `failed to update the database: ${error.message}`;
    console.error(errorMessage);

    return { status: 500, data: errorMessage };
  }
  
}

exports.findGames = async (appName, perPage, page) => {
  const url = 'mongodb://localhost:27017';

  let skip = 0;
  if (page > 0) {
    skip = parseInt(perPage * (page - 1));
  }
  if (perPage < 1) {
    perPage = 1;
  }
  try {
    await connect(url);

    const games = await steamGame.find({ name: new RegExp('.*' + appName + '.*', 'i') }, 'name appid', { limit: parseInt(perPage), skip: skip });
    console.info('Game search results: ', games);

    mongoose.connection.close();

    return { status: 200, data: games };
  } catch (error) {
    const errorMessage = `Couldn't query the database: ${error}`;
    console.error(errorMessage);

    return { status: 500, data: errorMessage };
  }
  
};
