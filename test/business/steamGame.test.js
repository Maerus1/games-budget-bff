const sinon = require('sinon');
const { assert } = require('chai');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { SteamGame } = require('./../../src/models/SteamGame');
const steamGame = mongoose.model('SteamGame', SteamGame);

const { updateSteamCollection, findGames } = require('./../../src/business/steamGame');

describe('Business logic tests', () => {
  describe('Steam Game business logic tests', () => {
    let connectStub;
    let disconnectStub;
    beforeEach(() => {
      connectStub = sinon.stub(mongoose, 'connect').resolves();
      disconnectStub = sinon.stub(mongoose.connection, 'close');
    });
    afterEach(() => {
      connectStub.restore();
      disconnectStub.restore();
    });
    it('should successfully update every Steam item in a mongo database and return the collection', async () => {
      // Arrange
      const fetchResponse = {
        json: () => {
          return {
            applist: {
              apps: [
                {
                  name: 'A Game',
                  appid: 23234
                },
                {
                  name: 'Another Game',
                  appid: 1111
                }
              ]
            }
          }
        }
      }
      const resolvedJson = fetchResponse.json().applist.apps;
      const insertedCollection = [
        {
          _id: 'sdf32fwef',
          name: resolvedJson[0].name,
          appid: resolvedJson[0].appid,
          __v: 0
        },
        {
          _id: 'sdf32fweasdf',
          name: resolvedJson[1].name,
          appid: resolvedJson[1].appid,
          __v: 0
        }
      ]
      
      const expected = {
        status: 200,
        data: insertedCollection
      }

      const fetchStub = sinon.stub(fetch, 'Promise').returns(Promise.resolve(fetchResponse));
      const steamGameDeleteStub = sinon.stub(steamGame, 'deleteMany').resolvesThis();
      const steamGameInsertStub = sinon.stub(steamGame, 'insertMany').resolves(insertedCollection);
       
      // Act
      const result = await updateSteamCollection();
      // Assert
      assert.deepEqual(result, expected);
      steamGameDeleteStub.restore();
      steamGameInsertStub.restore();
      fetchStub.restore();
    });
    it('should fail to fetch the records from Steam for updating the database', async () => {
      // Arrange
      const failedFetch = new Error(`can't connect to Steam`);
      const expected = {
        status: 500,
        data: `failed to update the database: ${failedFetch.message}`
      }

      const fetchStub = sinon.stub(fetch, 'Promise').returns(Promise.reject(failedFetch));
      // Act
      const result = await updateSteamCollection();
      // Assert
      assert.deepEqual(result, expected);
      fetchStub.restore();
    });

    it('should find all the games in the mongo database given a specific search query', async () => {
      // Arrange
      const appName = 'Halo';
      const returnedGames = [
        {
          _id: 'dsfweef',
          name: 'Halo: Combat Evolved',
          appid: 234234234,
          __v: 0
        }
      ]
      const expected =  {
        status: 200,
        data: returnedGames
      };
      const searchStub = sinon.stub(steamGame, 'find').returns(returnedGames);
      // Act
      const result = await findGames(appName);

      // Assert
      assert.deepEqual(result, expected);
      searchStub.restore();
    });

    it('should fail to connect to the database while finding records', async () => {
      // Arrange
      const appName = 'Halo';
      const mongoError = new Error(`Can't connect to the db`);
      const expected =  {
        status: 500,
        data: `Couldn't query the database: ${mongoError}`
      };
      connectStub.restore();
      connectStub = sinon.stub(mongoose, 'connect').rejects(mongoError);
      // Act
      const result = await findGames(appName);

      // Assert
      assert.deepEqual(result, expected);
    });
  });
});