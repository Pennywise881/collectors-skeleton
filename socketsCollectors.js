function sockets(io, socket, data)
{
  socket.on("setupCollectors", function (d)
  {
    data.createRoom(d.roomId, d.playerCount, d.lang);
  });
  socket.on("collectorsLoaded", function (d)
  {

    socket.join(d.roomId);
    if (data.joinGame(d.roomId, d.playerId))
    {
      socket.emit("collectorsInitialize", {
        labels: data.getUILabels(d.roomId),
        players: data.getPlayers(d.roomId),
        itemsOnSale: data.getItemsOnSale(d.roomId),
        marketValues: data.getMarketValues(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        deckAuction: data.getDeckauctionCard(d.roomId),
        placements: data.getPlacements(d.roomId),
        round: data.getRound(d.roomId),
        decKAuction: data.getDeckauctionCard(d.roomId),
        playerState: data.getPlayerState(d.roomId, d.playerId),
        currentPlayerId: data.getCurrentPlayerId(d.roomId),
        startNextRound: data.getStartNextRound(d.roomId),
        zoomLink: data.getZoomLink(d.roomId),
        playersId:data.getPlayersId(d.roomId)
      });
    }
  });
  socket.on("updatePlayerName", function (d)
  {
    io.to(d.roomId).emit(
      "updatePlayerName",
      data.updatePlayerName(d.roomId, d.playerId, d.playerName)
    );
  });

  socket.on("updateZoomLink", function (d)
  {
    io.to(d.roomId).emit(
      "updateZoomLink",
      data.setZoomLink(d.roomId, d.zoomLink)
    );
  });

  socket.on("updatePlayerAuction", function (d)
  {
    // console.log("insockets" + d.auction_amount)
    io.to(d.roomId).emit(
      "updatePlayerName",
      data.updatePlayerAuction(d.roomId, d.playerId, d.auction_amount)
    );
  });

  socket.on("nextRound", function (d)
  {
    if (data.nextRound(d.roomId))
    {
      io.to(d.roomId).emit("updateQuarter", {
        players: data.getPlayers(d.roomId),
        itemsOnSale: data.getItemsOnSale(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        marketValues: data.getMarketValues(d.roomId),
        deckAuction: data.getDeckauctionCard(d.roomId),
        placements: data.getPlacements(d.roomId),
        round: data.getRound(d.roomId),
        currentPlayerId: data.getCurrentPlayerId(d.roomId),
        startNextRound: data.getStartNextRound(d.roomId),

      });
    }
  });

  socket.on("notifyPlayers", function (d)
  {
    io.to(d.roomId).emit("notifyPlayers", data.getPlayers(d.roomId));
  });
  socket.on("collectorsDrawCard", function (d)
  {
    io.to(d.roomId).emit(
      "collectorsCardDrawn",
      data.drawCard(d.roomId, d.playerId)
    );
  });
  socket.on("collectorsBuyCard", function (d)
  {
    console.log("sockets collectorBuyCard type of d.p: " + typeof d.p);

    data.buyCard(
      d.roomId,
      d.playerId,
      d.card,
      d.cost,
      d.action,
      d.start_auction,
      d.deckCardAvailable,
      d.p,




    );
    io.to(d.roomId).emit("collectorsCardBought", {
      playerId: d.playerId,
      players: data.getPlayers(d.roomId),
      itemsOnSale: data.getItemsOnSale(d.roomId),
      skillsOnSale: data.getSkillsOnSale(d.roomId),
      auctionCards: data.getAuctionCards(d.roomId),
      deckAuction: data.getDeckauctionCard(d.roomId),
      marketValues: data.getMarketValues(d.roomId),
      action: d.action,
      startNextRound: data.getStartNextRound(d.roomId),
    });
  });
  socket.on("collectorsPlaceBottle", function (d)
  {
    console.log("sockets placeBottle");
    data.placeBottle(d.roomId, d.playerId, d.action, d.p);

    console.log("sockets placeBottle after data.placeBottle");
    io.to(d.roomId).emit(
      "collectorsBottlePlaced",
      data.getPlacements(d.roomId)
    );
  });



  socket.on("endGame", function (roomId)
  {
    console.log("endGame socket");
    data.endGame(roomId);

    console.log('datahandler getwinnerid: '+ data.getWinner(roomId));

    io.to(roomId).emit('collectorsFinalScore',
      data.getWinner(roomId));
  });

  socket.on('collectorsBottleClicked', function (d)
  {
    data.bottleClicked(d.roomId, d.playerId, d.saleItems, d.action, d.clickedOnBottle);
    io.to(d.roomId).emit('collectorsBottleClicked',
      data.getPlayers(d.roomId)
    );

  });

}
module.exports = sockets;
