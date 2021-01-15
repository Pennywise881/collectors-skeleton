"use strict";

let csv = require("csvtojson");

let collectorsDeck = "collectors-cards";
let languages = ["en", "se"];

/* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a)
{
  for (let i = a.length - 1; i > 0; i--)
  {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Store data in an object to keep the global namespace clean
function Data()
{
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
Data.prototype.initializeTable = function (table)
{
  csv({ checkType: true })
    .fromFile("./data/" + table + ".csv")
    .then((jsonObj) =>
    {
      this.data[table] = jsonObj;
    });
};

Data.prototype.initializeData = function ()
{
  console.log("Starting to build data tables");
  for (let i in languages)
  {
    this.initializeTable(collectorsDeck);
  }
};

Data.prototype.getUILabels = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    let lang = room.lang;
    var ui = require("./data/collectors-" + lang + ".json");
    return ui;
  } else return {};
};

Data.prototype.createRoom = function (roomId, playerCount, lang = "en")
{
  let room = {};
  room.players = {};
  room.playersId=[];
  room.winnerId = null,
    room.highestPoints = 0;
  room.calcPlayersTurnsPerformed = 0;
  room.setNextPlayer = false;
  room.firstTojoin = true;
  room.turnToPlay = null;
  room.currentPlayerId = null;
  room.playerColors = ["violet", "blue", "brown", "grey"];
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playerCount = playerCount;
  room.itemsOnSale = room.deck.splice(0, 5);
  room.skillsOnSale = room.deck.splice(0, 5);
  room.auctionCards = room.deck.splice(0, 4);
  room.market = [];
  room.deckAuction = [];
  room.startNextRound = false;
  room.zoomLink = "";

  room.buyPlacement = [
    {
      cost: 1,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 1,
      clickCardTimes: 1,
      color: null,

    },
    {
      cost: 1,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 2,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 2,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 3,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 2,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 4,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 3,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 5,
      clickCardTimes: 1,
      color: null,
    },
  ];
  room.skillPlacement = [
    {
      cost: 0,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 6,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 0,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 7,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 0,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 8,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 1,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 9,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 1,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 10,
      clickCardTimes: 1,
      color: null,
    },
  ];
  room.workPlacement = [
    {
      cost: 0,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 2,
      buttonId: 11,
      clickCardTimes: 2,
      color: null,
    },
    {
      cost: -1,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 12,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 1,
      playerId: null,
      bottleType: "normal",
      recieveCards: 2,
      cashForCard: 0,
      buttonId: 13,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 0,
      playerId: null,
      bottleType: "normal",
      recieveCards: 1,
      cashForCard: 0,
      buttonId: 14,
      clickCardTimes: 1,
      becomeFirstPlayer: true,
      color: null,
    },
    {
      cost: 0,
      playerId: null,
      bottleType: "normal",
      recieveCards: 1,
      cashForCard: 1,
      buttonId: 15,
      clickCardTimes: 1,
      color: null,
    },
  ];
  room.auctionPlacement = [
    {
      cost: -2,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 16,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: -1,
      playerId: null,
      bottleType: "normal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 17,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 0,
      playerId: null,
      bottleType: "auctionMedal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 18,
      clickCardTimes: 1,
      color: null,
    },
    {
      cost: 0,
      playerId: null,
      bottleType: "auctionMedal",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 19,
      clickCardTimes: 1,
      color: null,
    },
  ];
  room.marketPlacement = [
    {
      cost: 0,
      playerId: null,
      bottleType: "marketTwoBlue",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 20,
      raiseValue: 2,
      clickCardTimes: 2,
      color: null,
    },
    {
      cost: 2,
      playerId: null,
      bottleType: "marketDollar",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 21,
      raiseValue: 2,
      clickCardTimes: 2,
      color: null,
    },
    {
      cost: 0,
      playerId: null,
      bottleType: "marketOneBlue",
      recieveCards: 0,
      cashForCard: 0,
      buttonId: 22,
      raiseValue: 1,
      clickCardTimes: 1,
      color: null,
    },
  ];
  room.round = 1;
  this.rooms[roomId] = room;
};

Data.prototype.createDeck = function ()
{
  // we want a copy of the deck array, not a reference to it so we use the
  // spread operator (...) to copy the items. Note that this is a shallow copy
  // so it is not generalizable to all copy problems
  let deck = [...this.data[collectorsDeck]];
  return shuffle(deck);
};

Data.prototype.joinGame = function (roomId, playerId)
{
  console.log('dataHandler joinGame');

  let room = this.rooms[roomId];

  //set who starts, first to join starts the game
  if (room.firstTojoin)
  {
    room.turnToPlay = true;
    room.firstTojoin = false;
    room.currentPlayerId = playerId;
    

  }
  else
  {
    room.turnToPlay = false;

  }


  if (typeof room !== "undefined")
  {
    if (typeof room.players[playerId] !== "undefined")
    {
      
      console.log(
        "Player",
        playerId,
        "joined again with info",
        room.players[playerId]
      );
      return true;
    } else if (Object.keys(room.players).length < room.playerCount)
    {
      
      console.log("Player", playerId, "joined for the first time");
      room.playersId.push(playerId);
      console.log(room.playersId , " all players");
      room.players[playerId] = {
        playerName: playerId,
        hand: room.deck.splice(0, 3), // Two cards are kept secret and form the hands of each player
        money: Object.keys(room.players).length + 2,
        points: 0,
        skills: [],
        items: [],
        income: [],
        secret: {},
        color: room.playerColors.pop(),
        bottles: 2,
        cardsForCash: 0,
        auction_amount: 0,
        start_auction: true,
        playersTurn: room.turnToPlay,
        starts_round: room.turnToPlay,
        clickedOnBottle: false,
        points: 0,
        winner: null,
        choseSecretCard: true,
        playerState:
        {
          saleItems: [],
          action: "",
        }
      };

      return true;
    }
    console.log("Player", playerId, "was declined due to player limit");
  }
  return false;
};

Data.prototype.setZoomLink = function (roomId, zoomLink)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    room.zoomLink = zoomLink;
    return room.zoomLink;
  }
}

Data.prototype.getZoomLink = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    return room.zoomLink;
  }
}

Data.prototype.getPlayers = function (id)
{
  let room = this.rooms[id];
  if (typeof room !== "undefined")
  {
    return room.players;
  } else return {};
};

Data.prototype.getRound = function (id)
{
  let room = this.rooms[id];
  if (typeof room !== "undefined")
  {
    return room.round;
  } else return {};
};

Data.prototype.updatePoints = function (roomId, player, points)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    room.points[player] += points;
    return room.points;
  }
  else return {};
};

Data.prototype.getPlayerState = function (roomId, playerId)
{
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined')
  {
    return room.players[playerId].playerState;
  }
  else return {};
}

Data.prototype.updatePlayerName = function (roomId, playerId, playerName)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    room.players[playerId].playerName = playerName;
    return room.players;
  } else return {};
  // console.log("From data handler, Room Id: " + roomId + ", player Id: " + playerId + ", new name: " + playerName);
};

Data.prototype.nextRound = function (roomId)
{

  console.log('next round');
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    // PHASE 2: FILL POOLS
    // Step 1: Take the lowest card in the skill pool and place it in the market pool.
    for (let index = room.skillsOnSale.length - 1; index > -1; index--)
    {
      if (Object.keys(room.skillsOnSale[index]).length != 0)
      {
        // Push that into market pool
        room.market.push(room.skillsOnSale[index]);
        // Remove that card from skill pool
        room.skillsOnSale[index] = {};
        break;
      }
    }
    // Step 1: Move the remaining cards in the skill pool to the lowest empty positions in the skill pool
    const pool = room.skillsOnSale.map((object) => ({ ...object }));
    room.skillsOnSale = [{}, {}, {}, {}, {}];
    let saleIndex = 4;
    for (let index = pool.length - 1; index > -1; index--)
    {
      if (Object.keys(pool[index]).length != 0)
      {
        room.skillsOnSale[saleIndex] = pool[index];
        saleIndex--;
      }
    }
    // Step 2: Take the leftmost card in the item pool and place it in the lowest free position in the skill pool
    const itemPool = room.itemsOnSale.map((object) => ({ ...object }));
    room.itemsOnSale = [{}, {}, {}, {}, {}];
    saleIndex = 4;
    let firstEmptyPosition = 4;
    for (let index = room.skillsOnSale.length - 1; index > -1; index--)
    {
      if (Object.keys(room.skillsOnSale[index]).length == 0)
      {
        firstEmptyPosition = index;
        break;
      }
    }
    // Repeat this process until the item pool is empty
    let itemPosition = 0;
    for (let index = 0; index < itemPool.length; index++)
    {
      if (Object.keys(itemPool[index]).length != 0)
      {
        // Repeat this process until the skill pool is full
        if (firstEmptyPosition > -1)
        {
          room.skillsOnSale[firstEmptyPosition] = itemPool[index];
          firstEmptyPosition--;
        }
        // Move any remaining cards in the item pool to the leftmost empty positions in the item pool.
        else if (itemPosition < 5)
        {
          room.itemsOnSale[itemPosition] = itemPool[index];
          itemPosition++;
        } else
        {
          console.log("Issue in Step 2 of Phase 2: Fill Pools");
        }
      }
    }
    // Step3: Take the “lowest” card in the auction pool and place it in the market pool
    for (let index = room.auctionCards.length - 1; index > -1; index--)
    {
      if (Object.keys(room.auctionCards[index]).length != 0)
      {
        // Push that into market pool
        room.market.push(room.auctionCards[index]);
        // Remove that card from auction pool
        room.auctionCards[index] = {};
        break;
      }
    }
    // Move the remaining cards in the auction pool to the lowest empty positions in the Auction pool
    const auctionPool = room.auctionCards.map((object) => ({ ...object }));
    room.auctionCards = [{}, {}, {}, {}];
    let auctionIndex = 3;
    for (let index = auctionPool.length - 1; index > -1; index--)
    {
      if (Object.keys(auctionPool[index]).length != 0)
      {
        room.auctionCards[auctionIndex] = auctionPool[index];
        auctionIndex--;
      }
    }
    // Step 4: Now refill all pools
    for (let index = 0; index < 5; index++)
    {
      // Fill items pool
      if (Object.keys(room.itemsOnSale[index]).length == 0)
      {
        room.itemsOnSale[index] = room.deck.pop();
      }
      // Fill skills pool
      if (Object.keys(room.skillsOnSale[index]).length == 0)
      {
        room.skillsOnSale[index] = room.deck.pop();
      }
    }
    // Fill auctions pool
    for (let index = 0; index < 4; index++)
    {
      if (Object.keys(room.auctionCards[index]).length == 0)
      {
        room.auctionCards[index] = room.deck.pop();
      }
    }
    // PHASE 3: RETRIEVE BOTTLES
    // player takes their bottles from the game board and places them on their player board
    for (let index = 0; index < 5; index++)
    {
      if (room.buyPlacement[index].playerId != null)
      {
        // give the bottle back to the player
        room.players[room.buyPlacement[index].playerId].bottles += 1;
        // remove the player name from the position
        room.buyPlacement[index].playerId = null;
      }
      if (room.skillPlacement[index].playerId != null)
      {
        // give the bottle back to the player
        room.players[room.skillPlacement[index].playerId].bottles += 1;
        // remove the player name from the position
        room.skillPlacement[index].playerId = null;
      }
      if (room.workPlacement[index].playerId != null)
      {
        // give the bottle back to the player
        room.players[room.workPlacement[index].playerId].bottles += 1;
        // remove the player name from the position
        room.workPlacement[index].playerId = null;
      }
      if (index < 3)
      {
        if (room.marketPlacement[index].playerId != null)
        {
          // give the bottle back to the player
          room.players[room.marketPlacement[index].playerId].bottles += 1;
          // remove the player name from the position
          room.marketPlacement[index].playerId = null;
        }
      }
      if (index < 4)
      {
        if (room.auctionPlacement[index].playerId != null)
        {
          // give the bottle back to the player
          room.players[room.auctionPlacement[index].playerId].bottles += 1;
          // remove the player name from the position
          room.auctionPlacement[index].playerId = null;
        }
      }
    }

    // PHASE 4: GET INCOME
    for (var key in room.players)
    {
      if (room.players.hasOwnProperty(key))
      {
        // Each player takes one coin for each income symbol on the player board that is not covered by a bottle
        // Draw one card, unless a bottle covers the “draw one card” symbol.
        if (room.players[key].bottles < 3)
        {
          // Take one card
          let card = room.deck.pop();
          room.players[key].hand.push(card);
          // Get three coins
          room.players[key].money += 3;
        } else if (room.players[key].bottles == 3)
        {
          // Get three coins
          room.players[key].money += 3;
        } else if (room.players[key].bottles == 4)
        {
          // Get two coins
          room.players[key].money += 2;
        }
        // for each card tucked under the player board with an income symbol on it
        room.players[key].money += room.players[key].cardsForCash;
        room.players[key].cardsForCash = 0;
      }
    }

    // PHASE 5: REMOVE A QUARTER TILE
    room.round = room.round + 1;
    if (room.round == 4)
    {
      room.workPlacement[0].clickCardTimes = 0;
      room.workPlacement[0].cashForCard = 0;
    }
    room.workPlacement[0].cost -= 1;


    // PHASE 6: DECIDE WHO STARTS NEXT ROUND
    console.log('Phase 6');
    for (var key in room.players)
    {
      console.log('Phase 6 for loop');
      if (room.players[key].starts_round)
      {
        room.players[key].playersTurn = true;
        room.currentPlayerId = key
      } else
      {
        room.players[key].playersTurn = false;
      }

      console.log('next round: ' + key + ' ' + room.players[key].playersTurn);
    }

    //set startNextRound to false
    room.startNextRound = false;


    return true;
  } else
  {
    console.log("Error moving to next round");
    return false;
  }
};

Data.prototype.updatePlayerAuction = function (
  roomId,
  playerId,
  auction_amount
)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    room.players[playerId].auction_amount = auction_amount;
    return room.players;
  } else return {};
};

/* returns players after a new card is drawn */
Data.prototype.drawCard = function (roomId, playerId)
{
  console.log(roomId, playerId);
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    let card = room.deck.pop();
    room.players[playerId].hand.push(card);
    return room.players;
  } else return [];
};

/* moves card from itemsOnSale to a player's hand */
Data.prototype.buyCard = function (
  roomId,
  playerId,
  card,
  cost,
  action,
  start_auction,
  deckCardAvailable,
  p
)
{

  console.log('datahandler buy card p: ' + typeof p);
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    let c = null;

    // check first if the player has enough bottles and money to buy the card
    /*if (
      room.players[playerId].money < cost ||
      room.players[playerId].bottles < 1
    ) {
      console.log(
        "Player doesn't have enough money or bottles to buy the card"
      );
      return;
    }*/

    /// check first if the card is among the items on sale
    if (action === "buy")
    {
      console.log("reach buy");

      for (let i = 0; i < room.itemsOnSale.length; i += 1)
      {
        // since card comes from the client, it is NOT the same object (reference)
        // so we need to compare properties for determining equality
        if (
          room.itemsOnSale[i].x === card.x &&
          room.itemsOnSale[i].y === card.y
        )
        {
          c = room.itemsOnSale.splice(i, 1, {});
          break;
        }
      }
      // ...then check if it is in the hand. It cannot be in both so it's safe
      for (let i = 0; i < room.players[playerId].hand.length; i += 1)
      {
        // since card comes from the client, it is NOT the same object (reference)
        // so we need to compare properties for determining equality
        if (
          room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y
        )
        {
          c = room.players[playerId].hand.splice(i, 1,{});
          break;
        }
      }
      room.players[playerId].items.push(...c);
    } else if (action === "skill")
    {
      console.log("reach skill");
      for (let i = 0; i < room.skillsOnSale.length; i += 1)
      {
        // since card comes from the client, it is NOT the same object (reference)
        // so we need to compare properties for determining equality
        if (
          room.skillsOnSale[i].x === card.x &&
          room.skillsOnSale[i].y === card.y
        )
        {
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

      if (card.skill === 'bottle')
      {
        room.players[playerId].bottles += 1;
      }

    } else if (action === "auction")
    {
      for (let i = 0; i < room.auctionCards.length; i += 1)
      {
        if (
          room.auctionCards[i].x === card.x &&
          room.auctionCards[i].y === card.y
        )
        {
          c = room.auctionCards.splice(i, 1, {});

          break;
        }
      }

      const count = 0;
      Object.keys(this.rooms).forEach((room) =>
      {
        this.rooms[room].deckAuction = []
        this.rooms[room].deckAuction.push(...c);
        Object.keys(this.rooms[room].players).forEach((player) =>
        {
          this.rooms[room].players[player].start_auction = start_auction;
          this.rooms[room].players[player].deckCardAvailable = true;
        });
      });

      // room.players[playerId].items.push(...c);

      for (var key in room.players)
      {

        for (var i in room.players[key].skills)
        {
          if (room.players[key].skills[i].skill === 'auctionIncome')
          {
            room.players[key].money += 1;
          }
        }
      }


    } else if (action === "win_auction")
    {
      for (let i = 0; i < room.deckAuction.length; i += 1)
      {
        if (
          room.deckAuction[i].x === card.x &&
          room.deckAuction[i].y === card.y
        )
        {
          c = room.deckAuction.splice(i, 1, {});

          break;
        }
      }

      room.players[playerId].items.push(...c);
      room.players[playerId].money -= cost;

      Object.keys(this.rooms).forEach((room) =>
      {
        Object.keys(this.rooms[room].players).forEach((player) =>
        {
          this.rooms[room].players[player].start_auction = start_auction;
          this.rooms[room].players[player].deckCardAvailable = false;
          this.rooms[room].players[player].auction_amount = 0;
        });
      });
      // room.players[playerId].money -= cost;
      // room.players[playerId].bottles -= 1;
      console.log("remove bottle");
    } else if (action === "market")
    {
      console.log("dataHandler buyCard market");
      room.players[playerId].cardsForCash += 1;
      for (let i = 0; i < room.players[playerId].hand.length; i += 1)
      {
        if (
          room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y
        )
        {
          room.players[playerId].hand.splice(i, 1);
          break;
        }
      }
    }
    //exchanges a card in hand for income
    else if (action === "hand")
    {
      console.log("dataHandler room.fastaval: " + room.fastaval);
      console.log("hand datahandler secret " + p);

      //add card to secret card
      if (room.players[playerId].choseSecretCard)
      {

        room.players[playerId].secret = card;
        room.players[playerId].choseSecretCard = false;

      }

      if (p !== null)
      {

        //get cash for card clicked
        if (p.cashForCard > 0)
        {
          room.players[playerId].cardsForCash += 1;
        }


        //raise value of card clicked
        if (p.raiseValue > 0)
        {
          room.market.push(card);
          console.log('raise market value');
        }
      }


      //remove card from hand
      for (let i = 0; i < room.players[playerId].hand.length; i += 1)
      {
        if (
          room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y
        )
        {
          room.players[playerId].hand.splice(i, 1);
          break;
        }
      }
    }


  }
  room.players[playerId].clickedOnBottle = false;
  room.players[playerId].playerState.saleItems = [];
  room.players[playerId].playerState.action = "";

  //check if next round should be alerted
  var playersWithoutBottles = 0;
  for (var id in room.players)
  {
    console.log('inside for buycard datahandler')
    if (
      room.players[id].bottles === 0
    )
    {
      playersWithoutBottles += 1;
      console.log(playersWithoutBottles);
    }

  }

  if (playersWithoutBottles === room.playerCount)
  {
    room.startNextRound = true;
  }


};

Data.prototype.bottleClicked = function (roomId, playerId, saleItems, action, clickedOnBottle, cost)
{
  let room = this.rooms[roomId];
  room.players[playerId].clickedOnBottle = clickedOnBottle;
  room.players[playerId].playerState.saleItems = saleItems;
  room.players[playerId].playerState.action = action;
}


Data.prototype.placeBottle = function (roomId, playerId, action, p)
{


  this.calcPlayersTurns(roomId, playerId);

  var buttonId = p.buttonId;
  var cost = p.cost;
  let room = this.rooms[roomId];
  console.log(room.players[playerId].money);

  //remove one bottle for a player
  room.players[playerId].bottles -= 1;

  //calculate money left after placement
  room.players[playerId].money -= p.cost;
  console.log(room.players[playerId].money);


  //skill workerIncome
  if (action === "work")
  {
    if (room.players[playerId].skills.length > 0)
    {
      for (var i in room.players[playerId].skills)
      {
        if (
          room.players[playerId].skills[i].skill === "workerIncome"
        )
        {
          room.players[playerId].money += 2;
        }

      }
    }

    //check if next round alert should go of
    console.log('***************p.cashforcard datahandler placebottle: ' + p.cashForCard);
    if (p.cashForCard == 0 && p.buttonId !==16 &&p.buttonId !==17 && p.buttonId !==18 && p.buttonId !== 19)
    {
      console.log('inside if place bottle datahandler')

      var playersWithoutBottles = 0;
      for (var id in room.players)
      {
        console.log('inside for buycard datahandler')
        if (
          room.players[id].bottles === 0
        )
        {
          playersWithoutBottles += 1;
          console.log(playersWithoutBottles);
        }

      }

      if (playersWithoutBottles === room.playerCount)
      {
        room.startNextRound = true;
      }
    }


  }

  console.log('room.players[playerId].skills: ' + room.players[playerId].skills);
  // room.players[playerId].money = money;


  console.log("dataHandler typeof.this.players: " + typeof room.players[playerId]);


  if (typeof room !== "undefined")
  {
    let activePlacement = [];
    if (action === "buy")
    {
      activePlacement = room.buyPlacement;
    } else if (action === "skill")
    {
      console.log("dataHandler.placeBottle.skill");
      activePlacement = room.skillPlacement;
    } else if (action === "auction")
    {
      activePlacement = room.auctionPlacement;
    } else if (action === "work")
    {
      activePlacement = room.workPlacement;



      if (p.becomeFirstPlayer)
      {

        for (var key in room.players)
        {

          if (key == playerId)
          {
            room.players[key].starts_round = true;
          } else
          {
            room.players[key].starts_round = false;
          }

        }

      }


    } else if (action === "market")
    {
      activePlacement = room.marketPlacement;

    }
    for (let i = 0; i < activePlacement.length; i += 1)
    {
     

      

      if (
        activePlacement[i].buttonId === buttonId &&
        activePlacement[i].playerId === null
      )
      {
        activePlacement[i].playerId = playerId;
        activePlacement[i].color = room.players[playerId].color;

        break;
      }
    }
    
    console.log(room.players[playerId].money);
  }
};
/* returns the hand of the player */
Data.prototype.getCards = function (roomId, playerId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    let i = room.players.map((d) => d.playerId).indexOf(playerId);
    return room.players[i].hand;
  } else return [];
};

Data.prototype.getPlacements = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    return {
      buyPlacement: room.buyPlacement,
      skillPlacement: room.skillPlacement,
      auctionPlacement: room.auctionPlacement,
      marketPlacement: room.marketPlacement,
      workPlacement: room.workPlacement,
      players: room.players,
      currentPlayerId: room.currentPlayerId,
      startNextRound: room.startNextRound,
    };
  } else return {};
};

Data.prototype.getItemsOnSale = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    return room.itemsOnSale;
  } else return [];
};

Data.prototype.getMarketValues = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    let latestMarketValues = room.market.reduce(
      function (acc, obj)
      {
        let key = obj["market"];
        if (!acc[key])
        {
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

Data.prototype.getSkillsOnSale = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    return room.skillsOnSale;
  } else return [];
};

Data.prototype.getAuctionCards = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    return room.auctionCards;
  } else return [];
};

Data.prototype.getDeckauctionCard = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    return room.deckAuction;
  } else return [];
};
Data.prototype.getCurrentPlayerId = function (roomId)
{
  let room = this.rooms[roomId];
  if (typeof room !== "undefined")
  {
    return room.currentPlayerId;
  } else return [];
};

Data.prototype.calcPlayersTurns = function (roomId)
{
  let room = this.rooms[roomId];
  room.calcPlayersTurnsPerformed += 1;
  var nrOfLoops = 0;

  for (var key in room.players)
  {

    if (room.setNextPlayer)
    {
      if (room.players[key].bottles == 0)
      {
        room.players[key].playersTurn = false;
      } else
      {
        room.players[key].playersTurn = true;
        room.currentPlayerId = key;
        room.setNextPlayer = false;
      }
    } else if (room.players[key].playersTurn)
    {
      room.players[key].playersTurn = false;
      room.setNextPlayer = true;
    }


    nrOfLoops += 1;
    if (nrOfLoops == room.playerCount && room.setNextPlayer == true && room.calcPlayersTurnsPerformed == 1)
    {
      this.calcPlayersTurns(roomId);
    }

    console.log(key + ' ' + room.players[key].playersTurn)

  }

  room.calcPlayersTurnsPerformed = 0;





};

Data.prototype.endGame = function (roomId)
{

  //get room and market values
  let room = this.rooms[roomId];
  var marketValues = this.getMarketValues(roomId);


  //loop thorugh players
  for (var playerId in room.players)
  {

    console.log('Calculating score for player ' + playerId);

    //player being calculated
    var player = room.players[playerId];

    //check end-game skills of player
    var skillVpAll = 0;
    var skillVpFastaval = 0;
    var skillVpMovie = 0;
    var skillVpTechnology = 0;
    var skillVpFigures = 0;
    var skillVpMusic = 0;

    for (var i in player.skills)
    {
      if (player.skills[i].skill === 'VP-all')
      {
        skillVpAll += 1;
      }

      if (player.skills[i].skill === 'VP-fastaval')
      {
        skillVpFastaval += 1;
      }

      if (player.skills[i].skill === 'VP-movie')
      {
        skillVpMovie += 1;
      }

      if (player.skills[i].skill === 'VP-technology')
      {
        skillVpTechnology += 1;
      }
      if (player.skills[i].skill === 'VP-figures')
      {
        skillVpFigures += 1;
      }
      if (player.skills[i].skill === 'VP-music')
      {
        skillVpMusic += 1;
      }

    }



    /*//calculate points for players items----------
    for (var i in player.items) {
        var itemsValue = marketValues[player.items[i].item];
        console.log('datahandler endgam itemsValue: ' + itemsValue);
        player.points += itemsValue;

    }*/

    //add players secret card to items
    player.items.push(player.secret);

    console.log('Player points before starting: ' + player.points);
    //calculate and add points from items and check if player has one of every item

    for (var i in player.items)
    {
      if (player.items[i].item === 'fastaval')
      {

        var itemsValue = marketValues['fastaval'] + skillVpFastaval;
        var hasFastaval = true;

      } else if (player.items[i].item === 'movie')
      {

        var itemsValue = marketValues['movie'] + skillVpMovie;
        var hasMovie = true;

      } else if (player.items[i].item === 'technology')
      {
        var itemsValue = marketValues['technology'] + skillVpTechnology;
        var hasTechnology = true;

      } else if (player.items[i].item === 'figures')
      {

        var itemsValue = marketValues['figures'] + skillVpFigures;
        var hasFigures = true;

      } else if (player.items[i].item === 'music')
      {

        var itemsValue = marketValues['music'] + skillVpMusic;
        var hasMusic = true;

      }

      player.points += itemsValue;


      console.log('Item: ' + player.items[i].item + ' Value:' + itemsValue);
    }



    //if player has one of every item, add points given by VP-all
    if (hasFastaval && hasMovie && hasTechnology && hasFigures && hasMusic && skillVpAll > 0)
    {
      player.points += 5 * skillVpAll;
    }
    console.log('datahandler endgame itemsValue: ' + player.points);

    //calculate points from players money
    let moneyValue = Math.floor(player.money / 3);
    console.log('datahandler endgame moneyValue: ' + moneyValue);

    player.points += moneyValue;
    console.log('total points for ' + playerId + ' : ' + player.points);

    //compare players points with previous players an decide winner
    if (player.points >= room.highestPoints)
    {
      room.highestPoints = player.points;
      player.winner = true;
      room.winnerId = playerId
    }
  }
  console.log('the winner is playerId: ' + room.winnerId + ' with points: ' + room.highestPoints);





};


Data.prototype.getStartNextRound = function (id)
{
  let room = this.rooms[id];
  return room.startNextRound;
};

Data.prototype.getWinner = function (roomId)
{
  let room = this.rooms[roomId];
  return room.winnerId;
}
Data.prototype.getPlayersId=function(roomId){
  let room=this.rooms[roomId];
  return room.playersId;
}



module.exports = Data;
