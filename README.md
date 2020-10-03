# Overview
This project is a BFF service for a React app that I'm planning on writing where it will allow people to set a game budget and search for games on the site to decide what games to buy.

## Quick note about package management
This project uses yarn, so keep in mind that any PR submitted with a package-lock.json will be rejected.

# Installation
## Mongo DB
This project uses Mongo DB to store and retrieve all the titles on Steam, so to run this project locally you will need to have mongo running on your machine on port 27017. Here's a handy guide to get you set up: https://docs.mongodb.com/manual/installation/

## Running the thing locally
Here's installation instructions for yarn if you don't want to use npm: https://classic.yarnpkg.com/en/docs/install
Once mongo is up and running on your machine just do the following in the cli of your choice:
```
yarn install
yarn start
```
And if you want to test:
```
yarn test
```
OR if you want a coverage report:
```
yarn test:coverage
```

# How to use it locally
This api exposes two endpoints:
/v1/api/updateSteamCollection and /v1/api/findGames?appName={Enter name of game here}

They're both GET requests that take no tokens or any special headers from the client. The second request takes a query string parameter called 'appName' which is required. All you need to do is call those endpoints (in the order they're written) while the service is running and be on your merry way.

# How to contribute
If this gets to a point where people actually want to improve this codebase then please let me know and I'll update the develop branch and we can start creating feature branches off of that. Then please submit a PR for code review and assign it to me.

ttyl. ;)