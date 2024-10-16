# MapleStory iTCG

![Sketch Cardback](src/images/itcgCBsk2-sm.jpg)

Web client and server for the Maplestory iTCG card game built on the [boardgame](https://boardgame.io) framework.

Currently deployed and playable at [Maple.rs](https://maple.rs)

## Architecture

### Overview

There are three major components to maple.rs, the client, server, and database.

- The **client** implements the boardgame.io framework and contains all the game logic. It also contains all UI components and the game board.
  The client is served on its own server and communicates with the backend server via websockets for running games, and regular http for everything else.
- The backend **server** serves as the persistence layer for the application, and is responsible for coordinating storage for user data and game data, and multiplayer functionality.
  It runs a Koa server from boardgame.io that handles all game functions, and is extended with routes to handle user data and deck data.
- The server is backed by a postgresql **database**.

### Card Object

By reading through different card objects, most of the entries should be self-explanatory. However, there are a few fields that are worth mentioning:

**Skill**: This is the Skill that your character will gain when it levels up. It is also a generic type that denotes an Action to be used and its requirements.

> - Action: A single game move to be executed. All actions are currently under src/actions/actions.ts. ie. `quest`(draw card), `damage`, `buff`, `refresh`(heal) etc.

**Ability**: This field represents the text in the main body of the card that is executed when the card is played. It's a dictionary that can include the following 4 types, `Skill`, `Trigger`, `State`, and `Keyword`.

> - Skill: Same as above, but typically without requirements.
> - Trigger: The Trigger class is used to perform Actions on specific events. For example, when a card is played, when a card is destroyed, etc.
> - State: The State type is used to denote a permanent effect on cards. For example, giving your monsters +20 health, or your opponents monsters have confused.
> - Keyword: For monsters, denotes the static state of the monster. For example, `confused`, `fierce`, `stealthy`, `tough`. This is separate from `State` for reasons.

## Development

These directions are for Linux or MacOS. Windows users will need to adjust the commands accordingly.

### Requirements

1. Have Node.js installed
1. Have Docker installed
   1. If you don't want to use docker, you'll need to have a postgresql database running locally

### Setting up the project locally

1. Copy sample config

   ```bash
   cp config-sample.json config.json
   ```

1. Install dependencies for client and server

   ```bash
   npm install
   cd server && npm install
   ```

1. Create local database

   ```bash
   make create-local-db
   ```

   > Follow instructions to create and migrate the user database

1. Update host details in `src/config.ts` to point to your local server. Swap the two sets to use localhost.

   ```typescript
   // ...
   export const SERVER = 'https://server.maple.rs';
   export const CLIENT = 'maple.rs';
   // Comment out the 2 lines above, and uncomment the 2 lines below
   // export const SERVER = 'http://localhost:18000';
   // export const CLIENT = 'localhost';
   // ...
   ```

1. Create image files

   1. Obtain image files from the Maplestory iTCG plugin for LackeyCCG
   1. Use the crop scripts in `src/images/`, to process the full images into sections
      1. Use `cropChar.sh` and `cropNonChar.sh` to process individual Character cards and NonCharacter cards respsectively
      1. use `list.sh` to batch multiple cards to process all at once
   1. The resulting processed images should go in `src/images/`

1. Start server

   ```bash
   cd server && npm run build-server && npm run start-server
   ```

1. Start client (you will need a separate terminal window, unless you run the server in the background)

   ```bash
   npm start
   ```

You should be all set for developing locally. If you want to start testing cards immediately instead
of the website UI, make the following changes to start up inside a game.

1. Change the setup function in `src/game.ts`

   ```typescript
   // ...
   export const ITCG = {
     name: 'itcg',

     setup, // Replace this with the following
     // setup: preConfigSetup,

     playerView,

     turn: {
   // ...
   ```

1. Change the App source in `src/index.tsx`

   ```typescript
   // ...
   import App from './App'; // Replace this with the following
   // import App from './Local';
   // ...
   ```

1. Update the deck details in `src/decks` to test with different cards.

### DB Migrations

To create a migration
`npm run create-migration <name> -- --sql-file`
