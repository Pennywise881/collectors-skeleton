"use strict";

let csv = require("csvtojson");

let collectorsDeck = "collectors-cards";
let languages = ["en", "se"];

/* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Store data in an object to keep the global namespace clean
function Data() {
  this.data = {};
  this.rooms = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

/*
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeTable = function(table) {
  csv({ checkType: true })
    .fromFile("./data/" + table + ".csv")
    .then((jsonObj) => {
      this.data[table] = jsonObj;
    });
};

Data.prototype.initializeData = function() {
  console.log("Starting to build data tables");
  for (let i in languages) {
    this.initializeTable(collectorsDeck);
  }
};

Data.prototype.getUILabels = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let lang = room.lang;
    var ui = require("./data/collectors-" + lang + ".json");
    return ui;
  } else return {};
};

Data.prototype.createRoom = function(roomId, playerCount, lang = "en") {
  let room = {};
  room.players = {};
  room.playerColors = ["violet", "blue", "brown", "grey"];
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playerCount = playerCount;
  room.itemsOnSale = room.deck.splice(0, 5);
  room.skillsOnSale = room.deck.splice(0, 5);
  room.auctionCards = room.deck.splice(0, 4);
  room.market = [];
  room.buyPlacement = [
    { cost: 1, playerId: null, bottleType: "normal" },
    { cost: 1, playerId: null, bottleType: "normal" },
    { cost: 2, playerId: null, bottleType: "normal" },
    { cost: 2, playerId: null, bottleType: "normal" },
    { cost: 3, playerId: null, bottleType: "normal" },
  ];
  room.skillPlacement = [
    { cost: 0, playerId: null, bottleType: "normal" },
    { cost: 0, playerId: null, bottleType: "normal" },
    { cost: 0, playerId: null, bottleType: "normal" },
    { cost: 1, playerId: null, bottleType: "normal" },
    { cost: 1, playerId: null, bottleType: "normal" },
  ];
  room.workPlacement = [
    { cost: -3, playerId: null, bottleType: "normal" },
    { cost: -1, playerId: null, bottleType: "normal" },
    { cost: 1, playerId: null, bottleType: "normal" },
    { cost: 0, playerId: null, bottleType: "normal" },
    { cost: 0, playerId: null, bottleType: "normal" },
  ];
  room.auctionPlacement = [
    { cost: -2, playerId: null, bottleType: "normal" },
    { cost: -1, playerId: null, bottleType: "normal" },
    { cost: 0, playerId: null, bottleType: "auctionMedal" },
    { cost: 0, playerId: null, bottleType: "auctionMedal" },
  ];
  room.marketPlacement = [
    { cost: 0, playerId: null, bottleType: "marketTwoBlue" },
    { cost: 2, playerId: null, bottleType: "marketDollar" },
    { cost: 0, playerId: null, bottleType: "marketOneBlue" },
  ];
  room.round = 1;
  this.rooms[roomId] = room;
};

Data.prototype.createDeck = function() {
  // we want a copy of the deck array, not a reference to it so we use the
  // spread operator (...) to copy the items. Note that this is a shallow copy
  // so it is not generalizable to all copy problems
  let deck = [...this.data[collectorsDeck]];
  return shuffle(deck);
};

Data.prototype.joinGame = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    if (typeof room.players[playerId] !== "undefined") {
      console.log(
        "Player",
        playerId,
        "joined again with info",
        room.players[playerId]
      );
      return true;
    } else if (Object.keys(room.players).length < room.playerCount) {
      console.log("Player", playerId, "joined for the first time");
      room.players[playerId] = {
        playerName: playerId,
        hand: room.deck.splice(0, 2), // Two cards are kept secret and form the hands of each player
        money: Object.keys(room.players).length + 2,
        points: 0,
        skills: [],
        items: [],
        income: [],
        secret: room.deck.splice(0, 1), // picks one card and places it face down, tucked under their player board at the position marked with a treasure chest.
        color: room.playerColors.pop(),
        bottles: 2,
      };
      return true;
    }
    console.log("Player", playerId, "was declined due to player limit");
  }
  return false;
};

Data.prototype.getPlayers = function(id) {
  let room = this.rooms[id];
  if (typeof room !== "undefined") {
    return room.players;
  } else return {};
};

Data.prototype.getRound = function(id) {
  let room = this.rooms[id];
  if (typeof room !== "undefined") {
    return room.round;
  } else return {};
};

Data.prototype.updatePoints = function(roomId, player, points) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.points[player] += points;
    return room.points;
  } else return {};
};

Data.prototype.updatePlayerName = function(roomId, playerId, playerName) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    room.players[playerId].playerName = playerName;
    return room.players;
  } else return {};
  // console.log("From data handler, Room Id: " + roomId + ", player Id: " + playerId + ", new name: " + playerName);
};

Data.prototype.nextRound = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    // Take the lowest card in the skill pool and place it in the market pool.
    for (let index = room.skillsOnSale.length-1; index > -1; index--){
      if (Object.keys(room.skillsOnSale[index]).length !=0 ) {
       // Push that into market pool
       room.market.push(room.skillsOnSale[index]);
       // Remove that card from skill pool
       room.skillsOnSale[index] = {};
       break;
      }
    }
    // Move the remaining cards in the skill pool to the lowest empty positions in the skill pool
    const skillsPool = room.skillsOnSale.map(object => ({ ...object }));
    room.skillsOnSale = [{},{},{},{},{}];
    let skillSaleIndex = 4;
    for (let index = skillsPool.length-1; index > -1; index--){
      if (Object.keys(skillsPool[index]).length !=0 ) {
      room.skillsOnSale[skillSaleIndex] = skillsPool[index];
      skillSaleIndex--;
      }
    }
    
    room.round = room.round + 1;
    return true;
  } else {
    console.log("Error moving to next round");
    return false;
  }
};

/* returns players after a new card is drawn */
Data.prototype.drawCard = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let card = room.deck.pop();
    room.players[playerId].hand.push(card);
    return room.players;
  } else return [];
};

/* moves card from itemsOnSale to a player's hand */
Data.prototype.buyCard = function(roomId, playerId, card, cost, action) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let c = null;

    // check first if the player has enough bottles and money to buy the card
    if (
      room.players[playerId].money < cost ||
      room.players[playerId].bottles < 1
    ) {
      console.log(
        "Player doesn't have enough money or bottles to buy the card"
      );
      return;
    }

    /// check first if the card is among the items on sale
    if (action === "buy") {
      console.log("reach buy");

      for (let i = 0; i < room.itemsOnSale.length; i += 1) {
        // since card comes from the client, it is NOT the same object (reference)
        // so we need to compare properties for determining equality
        if (
          room.itemsOnSale[i].x === card.x &&
          room.itemsOnSale[i].y === card.y
        ) {
          c = room.itemsOnSale.splice(i, 1, {});
          break;
        }
      }
      // ...then check if it is in the hand. It cannot be in both so it's safe
      for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
        // since card comes from the client, it is NOT the same object (reference)
        // so we need to compare properties for determining equality
        if (
          room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y
        ) {
          c = room.players[playerId].hand.splice(i, 1);
          break;
        }
      }
      room.players[playerId].items.push(...c);
      room.players[playerId].money -= cost;
      room.players[playerId].bottles -= 1;
    } else if (action === "skill") {
      console.log("reach skill");
      for (let i = 0; i < room.skillsOnSale.length; i += 1) {
        // since card comes from the client, it is NOT the same object (reference)
        // so we need to compare properties for determining equality
        if (
          room.skillsOnSale[i].x === card.x &&
          room.skillsOnSale[i].y === card.y
        ) {
          c = room.skillsOnSale.splice(i, 1, {});
          break;
        }
      }
      // // ...then check if it is in the hand. It cannot be in both so it's safe
      // for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      //   // since card comes from the client, it is NOT the same object (reference)
      //   // so we need to compare properties for determining equality
      //   if (room.players[playerId].hand[i].x === card.x &&
      //       room.players[playerId].hand[i].y === card.y) {
      //     c = room.players[playerId].hand.splice(i,1);
      //     break;
      //   }
      // }
      room.players[playerId].skills.push(...c);
      room.players[playerId].money -= cost;
      room.players[playerId].bottles -= 1;
    }
  }
};

Data.prototype.placeBottle = function(roomId, playerId, action, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let activePlacement = [];
    if (action === "buy") {
      activePlacement = room.buyPlacement;
    } else if (action === "skill") {
      activePlacement = room.skillPlacement;
    } else if (action === "auction") {
      activePlacement = room.auctionPlacement;
    } else if (action === "work") {
      activePlacement = room.workPlacement;
    } else if (action === "market") {
      activePlacement = room.marketPlacement;
    }
    for (let i = 0; i < activePlacement.length; i += 1) {
      if (
        activePlacement[i].cost === cost &&
        activePlacement[i].playerId === null
      ) {
        activePlacement[i].playerId = playerId;
        break;
      }
    }
  }
};
/* returns the hand of the player */
Data.prototype.getCards = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let i = room.players.map((d) => d.playerId).indexOf(playerId);
    return room.players[i].hand;
  } else return [];
};

Data.prototype.getPlacements = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return {
      buyPlacement: room.buyPlacement,
      skillPlacement: room.skillPlacement,
      auctionPlacement: room.auctionPlacement,
      marketPlacement: room.marketPlacement,
      workPlacement: room.workPlacement,
    };
  } else return {};
};

Data.prototype.getItemsOnSale = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.itemsOnSale;
  } else return [];
};

Data.prototype.getMarketValues = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    let latestMarketValues = room.market.reduce(
      function(acc, obj) {
        let key = obj["market"];
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += 1;
        return acc;
      },
      {
        fastaval: 0,
        movie: 0,
        technology: 0,
        figures: 0,
        music: 0,
      }
    );
    return latestMarketValues;
  } else return [];
};

Data.prototype.getSkillsOnSale = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.skillsOnSale;
  } else return [];
};

Data.prototype.getAuctionCards = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== "undefined") {
    return room.auctionCards;
  } else return [];
};

module.exports = Data;
