const Schema = require('mongoose').Schema;

const SteamGame = new Schema({
  appid: { type: Number },
  name: { type: String, default: '' }
});

exports.SteamGame = SteamGame;