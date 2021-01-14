<template>
  <div>
    <main>
      <div class="collectors-game">
        <section class="buy_item">
          <CollectorsBuyActions
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :itemsOnSale="itemsOnSale"
            :marketValues="marketValues"
            :placement="buyPlacement"
            @buyCard="buyCard('buy', $event)"
          />
        </section>
        <section class="buy_skill">
          <CollectorsBuyActions
            v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :itemsOnSale="skillsOnSale"
            :marketValues="marketValues"
            :placement="skillPlacement"
            @buyCard="buyCard('skill', $event)"
          />
        </section>

        <section
          v-if="!this.players[this.playerId].start_auction"
          id="players_auction"
          style="background: white height:90px width:60px"
        >
          <div class="auctionPopUp">
            <label class="auctionHeading">Auction</label><br />
            <label>Card on auction:</label>
            <section class="do_deckAuction">
              <CollectorsBuyActions
                v-if="players[playerId]"
                :labels="labels"
                :player="players[playerId]"
                :itemsOnSale="deckAuction"
                :deckCardAvailable="
                  this.players[this.playerId].deckCardAvailable
                "
                :marketValues="marketValues"
                :placement="auctionPlacement"
                @buyCard="buyCard('win_auction', $event)"
              />
            </section>
            <p style="padding: 0; margin: 0">
              <label style="color: red; font-size: 0.8rem">
                Click on the card if you have the highest bid!
              </label>
            </p>

            <label>Other players bids:</label><br />
            <div
              v-for="(val, key) in getOtherPlayersAuction()"
              :key="'Auction other players' + key"
              class="player_1_auction"
            >
              <label>{{ players[val.id].playerName }}</label>

              <input
                style="margin-left: 1.5vh"
                id="playerNameInputField"
                type="text"
                v-bind:value="val.auction_amount"
                v-on:keyup="updatePlayerAuction($event, val.id)"
              />
            </div>
            <label>Place your bids:</label>
            <div
              v-for="(val, key) in getThisPlayersAuction()"
              :key="'Auction this player' + key"
              class="player_1_auction"
            >
              <input
                id="playerNameInputField"
                type="text"
                v-bind:value="val.auction_amount"
                v-on:keyup="updatePlayerAuction($event, val.id)"
              />
            </div>
          </div>
        </section>

        <div class="game main-board">
          <section class="item_bottle">
            <Bottles
              v-if="players[playerId]"
              :labels="labels"
              :typeofaction="typeofaction"
              :player="players[playerId]"
              :itemsOnSale="itemsOnSale"
              :marketValues="marketValues"
              :placement="buyPlacement"
              @placeBottle="placeBottle('buy', $event)"
            />
          </section>
          <section class="skill_bottle">
            <Bottles
              v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :itemsOnSale="skillsOnSale"
              :marketValues="marketValues"
              :placement="skillPlacement"
              @placeBottle="placeBottle('skill', $event)"
            />
          </section>
          <section class="market_bottle">
            <Bottles
              v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :marketValues="marketValues"
              :placement="marketPlacement"
              :itemsOnSale="players[playerId].hand"
              @placeBottle="placeBottle('market', $event)"
            />
          </section>

          <section class="work_bottle">
            <Bottles
              v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :marketValues="marketValues"
              :itemsOnSale="players[playerId].hand"
              :placement="workPlacement"
              @placeBottle="placeBottle('work', $event)"
            />

            <div
              v-if="round > 0 && round < 4"
              class="quarter-tiles"
              :style="{
                backgroundImage: 'url(/images/quarter_tiles/' + round + '.png)',
              }"
            ></div>
          </section>
          <section class="auction_bottle">
            <Bottles
              v-if="players[playerId]"
              :labels="labels"
              :player="players[playerId]"
              :itemsOnSale="auctionCards"
              :marketValues="marketValues"
              :placement="auctionPlacement"
              @placeBottle="placeBottle('auction', $event)"
            />
            <section class="do_auction">
              <CollectorsBuyActions
                v-if="players[playerId]"
                :labels="labels"
                :player="players[playerId]"
                :itemsOnSale="auctionCards"
                :marketValues="marketValues"
                :placement="auctionPlacement"
                @buyCard="buyCard('auction', $event)"
              />
            </section>
          </section>
        </div>

        <div class="game player-board">
          <div class="upperRightButtons">
            <div class="activeplayer">
              <div>
                <img
                  :class="[
                    'player_avatar',
                    { avatar: this.players[playerId].playersTurn },
                  ]"
                  src="../../public/images/player_avatar/worker_man2.png"
                  v-bind:style="{
                    'background-color':
                      playerColors[this.players[this.currentPlayerId].color],
                  }"
                />
              </div>
            </div>
            <div v-if="this.round < 4 && !this.startNextRound">
              <button class="next_round" @click="nextRound()">
                Next round
              </button>
            </div>

            <div v-else-if="this.round < 4 && this.startNextRound">
              <button class="next_round_alert" @click="nextRound()">
                Next round
              </button>
            </div>
            <div v-if="this.round < 4">
              <button class="end_game" @click="endGame()">Final Score</button>
            </div>

            <div v-if="this.round == 4 && !this.startNextRound">
              <button class="end_game" @click="endGame()">Final Score</button>
            </div>

            <div v-else-if="this.round == 4 && this.startNextRound">
              <button class="end_game_alert" @click="endGame()">
                Final Score
              </button>
            </div>

            <div>
              <button class="link" @click="displayLinkBox('z')">
                Zoom Link
              </button>

              <button class="link" @click="displayLinkBox('r')">
                Room Link
              </button>

              <button class="link" @click="displayRules()">Game Rules</button>
            </div>
            <!-- <div>
              <button class="link" @click="displayLinkBox('r')">
                Room Link
              </button>
            </div> -->
            <!-- <div>
              <button class="link" @click="displayRules()">Rules</button>
            </div> -->
            <!-- <div v-if="this.showSendLinkPopUp" class="sendLinkPopUp">
              <p>Zoom link for players:</p>
              Paste zoom link:
              <input type="text" id="zoomLink" /><br />
              <input
                type="submit"
                value="Paste"
                @click="this.secretCardButton.play()"
              />
              <button style="margin: 0.5vh" @click="closeLinkPopUp()">
                Close
              </button>
            </div> -->
            <!-- 
            <div class="sendLinkPopUp">
              <p>Zoom link for players:</p>
              Paste zoom link:
              <input type="text" id="zoomLink" /><br />
              <input
                type="submit"
                value="Paste"
                @click="this.secretCardButton.play()"
              />
              <button style="margin: 0.5vh" @click="closeLinkPopUp()">
                Close
              </button>
            </div> -->
          </div>

          <!-- <div class="links">
            Room Link
            <input
              type="text"
              :value="publicPath + $route.path"
              @click="selectAll"
              readonly="readonly"
            />
            <br />
            Zoom Link
            <input
              id="zoomLink"
              type="text"
              v-bind:value="zoomLink"
              @change="updateZoomLink()"
              @click="selectAll"
            />
          </div> -->

          <div class="players-block">
            <div
              v-if="players.hasOwnProperty(playerId)"
              class="current-player"
              v-bind:style="{
                'background-color': playerColors[players[playerId].color],
              }"
            >
              <div class="player-details">
                <div class="player-name">
                  <label for="playerNameInputField" id="playerNameLabel">{{
                    players[playerId].playerName
                  }}</label>
                  <input
                    id="playerNameInputField"
                    type="text"
                    v-bind:value="players[playerId].playerName"
                    v-on:keyup="changeName($event)"
                    @click="selectAll"
                    autofocus="true"
                    hidden
                  /><img
                    id="nameChangeImg"
                    src="../../public/images/pencil.png"
                    v-on:click="setupNameChange()"
                  />
                  <br />
                </div>
                <div class="player-coins">
                  <p>
                    <img src="/images/player-coins.png" alt="Player Coins" />x{{
                      players[playerId].money
                    }}
                  </p>
                </div>
                <div class="player-cards-for-coins">
                  <img
                    src="/images/player-cards-for-coins.png"
                    alt="Player Cards for Coins"
                  />x{{ this.players[this.playerId].cardsForCash }}
                </div>
              </div>
              <div class="player-hand">
                <button
                  class="choose-secret-card"
                  v-if="this.players[this.playerId].choseSecretCard == true"
                  @click="choseSecretCard()"
                >
                  Click to choose secret card
                </button>
                <div
                  class="secret-card"
                  v-if="this.players[this.playerId].choseSecretCard == false"
                >
                  <CollectorsCard :card="players[playerId].secret" />
                </div>

                <div class="cardslots" v-if="players[playerId]">
                  <CollectorsBuyActions
                    v-if="players[playerId]"
                    :labels="labels"
                    :player="players[playerId]"
                    :itemsOnSale="players[playerId].hand"
                    :handCardAvailable="handCardAvailable"
                    :buttonClicked="buttonClicked"
                    :marketValues="marketValues"
                    :placement="buyPlacement"
                    @buyCard="buyCard('hand', $event)"
                  />
                </div>
              </div>
              <div
                class="player-bottles"
                :style="{
                  backgroundImage:
                    'url(' + playerBoards[players[playerId].color] + ')',
                }"
              >
                <img
                  v-for="index in players[playerId].bottles"
                  :key="'player-bottles' + index"
                  :src="playerBottle[players[playerId].color]"
                  alt="index"
                />
              </div>
              <div class="player-items-skills">
                <!-- if the active player has already buy an item -->
                <div
                  v-for="(card, index) in players[playerId].items"
                  :key="'items' + index"
                  class="player-items"
                >
                  <div v-if="card.item === 'movie'" class="player-items-1">
                    <img src="/images/items/movie.jpg" alt="Player Items 1" />
                    <p v-if="countitem(players[playerId].items, 'movie') > 1">
                      {{ playeritem["movie"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'music'" class="player-items-2">
                    <img src="/images/items/music.jpg" alt="Player Items 1" />
                    <p v-if="countitem(players[playerId].items, 'music') > 1">
                      {{ playeritem["music"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'fastaval'" class="player-items-3">
                    <img
                      src="/images/items/fastaval.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="countitem(players[playerId].items, 'fastaval') > 1"
                    >
                      {{ playeritem["fastaval"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'figures'" class="player-items-4">
                    <img src="/images/items/figures.jpg" alt="Player Items 1" />
                    <p v-if="countitem(players[playerId].items, 'figures') > 1">
                      {{ playeritem["figures"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'technology'" class="player-items-5">
                    <img
                      src="/images/items/technology.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countitem(players[playerId].items, 'technology') > 1
                      "
                    >
                      {{ playeritem["technology"] }}
                    </p>
                  </div>
                </div>

                <!-- if the active player has already buy a skill -->

                <div
                  v-for="(card, index) in players[playerId].skills"
                  :key="'skills' + index"
                  class="player-skills"
                >
                  <div v-if="card.skill === 'bottle'" class="player-skills-1">
                    <img
                      src="/images/skills/bottle.jpg"
                      alt="Player Skills 1"
                    />
                    <p
                      v-if="countskills(players[playerId].skills, 'bottle') > 1"
                    >
                      {{ playerskill["bottle"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'workerIncome'"
                    class="player-skills-2"
                  >
                    <img
                      src="/images/skills/workerIncome.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'workerIncome') >
                        1
                      "
                    >
                      {{ playerskill["workerIncome"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'workerCard'"
                    class="player-skills-3"
                  >
                    <img
                      src="/images/skills/workerCard.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'workerCard') > 1
                      "
                    >
                      {{ playerskill["workerCard"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'VP-technology'"
                    class="player-skills-4"
                  >
                    <img
                      src="/images/skills/VP-technology.jpg"
                      alt="Player Skills 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'VP-technology') >
                        1
                      "
                    >
                      {{ playerskill["VP-technology"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'VP-fastaval'"
                    class="player-skills-5"
                  >
                    <img
                      src="/images/skills/VP-fastaval.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'VP-fastaval') > 1
                      "
                    >
                      {{ playerskill["VP-fastaval"] }}
                    </p>
                  </div>
                  <div v-if="card.skill === 'VP-movie'" class="player-skills-6">
                    <img
                      src="/images/skills/VP-movie.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'VP-movie') > 1
                      "
                    >
                      {{ playerskill["VP-movie"] }}
                    </p>
                  </div>
                  <div v-if="card.skill === 'VP-music'" class="player-skills-7">
                    <img
                      src="/images/skills/VP-music.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'VP-music') > 1
                      "
                    >
                      {{ playerskill["VP-music"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'VP-figure'"
                    class="player-skills-8"
                  >
                    <img
                      src="/images/skills/VP-figure.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'VP-figure') > 1
                      "
                    >
                      {{ playerskill["VP-figure"] }}
                    </p>
                  </div>
                  <div v-if="card.skill === 'VP-all'" class="player-skills-9">
                    <img src="/images/skills/VP-all.jpg" alt="Player Items 1" />
                    <p
                      v-if="countskills(players[playerId].skills, 'VP-all') > 1"
                    >
                      {{ playerskill["VP-all"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'auctionIncome'"
                    class="player-skills-10"
                  >
                    <img
                      src="/images/skills/auctionIncome.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[playerId].skills, 'auctionIncome') >
                        1
                      "
                    >
                      {{ playerskill["auctionIncome"] }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="other-players"
              v-for="otherPlayerId in getOtherPlayerIds()"
              v-bind:key="otherPlayerId"
              v-bind:style="{
                'background-color': playerColors[players[otherPlayerId].color],
              }"
            >
              <div class="player-details">
                <div class="player-name">
                  Player: {{ players[otherPlayerId].playerName }}
                </div>
                <div class="player-coins">
                  <img src="/images/player-coins.png" alt="Player Coins" />x{{
                    players[otherPlayerId].money
                  }}
                </div>
                <div class="player-cards-for-coins">
                  <img
                    src="/images/player-cards-for-coins.png"
                    alt="Player Cards for Coins"
                  />x{{ players[otherPlayerId].cardsForCash }}
                </div>

                <div class="player-nr-cards">
                  <img
                    src="/images/backOfCard.png"
                    alt="Players number of cards"
                  />x{{ players[otherPlayerId].hand.length }}
                </div>
              </div>
              <div
                class="player-bottles"
                v-if="players.hasOwnProperty(playerId)"
                :style="{
                  backgroundImage:
                    'url(' + playerBoards[players[otherPlayerId].color] + ')',
                }"
              >
                <img
                  v-for="index in players[otherPlayerId].bottles"
                  :key="'other-player-bottles' + index"
                  :src="playerBottle[players[otherPlayerId].color]"
                  alt="index"
                />
              </div>
              <div class="player-items-skills">
                <div
                  v-for="(card, index) in players[otherPlayerId].items"
                  :key="'other-player-items' + index"
                  class="player-items"
                >
                  <div v-if="card.item === 'movie'" class="player-items-1">
                    <img src="/images/items/movie.jpg" alt="Player Items 1" />
                    <p
                      v-if="
                        countitem(players[otherPlayerId].items, 'movie') > 1
                      "
                    >
                      {{ playeritem["movie"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'music'" class="player-items-2">
                    <img src="/images/items/music.jpg" alt="Player Items 1" />
                    <p
                      v-if="
                        countitem(players[otherPlayerId].items, 'music') > 1
                      "
                    >
                      {{ playeritem["music"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'fastaval'" class="player-items-3">
                    <img
                      src="/images/items/fastaval.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countitem(players[otherPlayerId].items, 'fastaval') > 1
                      "
                    >
                      {{ playeritem["fastaval"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'figures'" class="player-items-4">
                    <img src="/images/items/figures.jpg" alt="Player Items 1" />
                    <p
                      v-if="
                        countitem(players[otherPlayerId].items, 'figures') > 1
                      "
                    >
                      {{ playeritem["figures"] }}
                    </p>
                  </div>
                  <div v-if="card.item === 'technology'" class="player-items-5">
                    <img
                      src="/images/items/technology.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countitem(players[otherPlayerId].items, 'technology') >
                        1
                      "
                    >
                      {{ playeritem["technology"] }}
                    </p>
                  </div>
                </div>

                <div
                  v-for="(card, index) in players[otherPlayerId].skills"
                  :key="'player-skills' + index"
                  class="player-skills"
                >
                  <div v-if="card.skill === 'bottle'" class="player-skills-1">
                    <img
                      src="/images/skills/bottle.jpg"
                      alt="Player Skills 1"
                    />
                    <p
                      v-if="
                        countskills(players[otherPlayerId].skills, 'bottle') > 1
                      "
                    >
                      {{ playerskill["bottle"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'workerIncome'"
                    class="player-skills-2"
                  >
                    <img
                      src="/images/skills/workerIncome.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(
                          players[otherPlayerId].skills,
                          'workerIncome'
                        ) > 1
                      "
                    >
                      {{ playerskill["workerIncome"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'workerCard'"
                    class="player-skills-3"
                  >
                    <img
                      src="/images/skills/workerCard.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(
                          players[otherPlayerId].skills,
                          'workerCard'
                        ) > 1
                      "
                    >
                      {{ playerskill["workerCard"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'VP-technology'"
                    class="player-skills-4"
                  >
                    <img
                      src="/images/skills/VP-technology.jpg"
                      alt="Player Skills 1"
                    />
                    <p
                      v-if="
                        countskills(
                          players[otherPlayerId].skills,
                          'VP-technology'
                        ) > 1
                      "
                    >
                      {{ playerskill["VP-technology"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'VP-fastaval'"
                    class="player-skills-5"
                  >
                    <img
                      src="/images/skills/VP-fastaval.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(
                          players[otherPlayerId].skills,
                          'VP-fastaval'
                        ) > 1
                      "
                    >
                      {{ playerskill["VP-fastaval"] }}
                    </p>
                  </div>
                  <div v-if="card.skill === 'VP-movie'" class="player-skills-6">
                    <img
                      src="/images/skills/VP-movie.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[otherPlayerId].skills, 'VP-movie') >
                        1
                      "
                    >
                      {{ playerskill["VP-movie"] }}
                    </p>
                  </div>
                  <div v-if="card.skill === 'VP-music'" class="player-skills-7">
                    <img
                      src="/images/skills/VP-music.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(players[otherPlayerId].skills, 'VP-music') >
                        1
                      "
                    >
                      {{ playerskill["VP-music"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'VP-figure'"
                    class="player-skills-8"
                  >
                    <img
                      src="/images/skills/VP-figure.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(
                          players[otherPlayerId].skills,
                          'VP-figure'
                        ) > 1
                      "
                    >
                      {{ playerskill["VP-figure"] }}
                    </p>
                  </div>
                  <div v-if="card.skill === 'VP-all'" class="player-skills-9">
                    <img src="/images/skills/VP-all.jpg" alt="Player Items 1" />
                    <p
                      v-if="
                        countskills(players[otherPlayerId].skills, 'VP-all') > 1
                      "
                    >
                      {{ playerskill["VP-all"] }}
                    </p>
                  </div>
                  <div
                    v-if="card.skill === 'auctionIncome'"
                    class="player-skills-10"
                  >
                    <img
                      src="/images/skills/auctionIncome.jpg"
                      alt="Player Items 1"
                    />
                    <p
                      v-if="
                        countskills(
                          players[otherPlayerId].skills,
                          'auctionIncome'
                        ) > 1
                      "
                    >
                      {{ playerskill["auctionIncome"] }}
                    </p>
                  </div>
                </div>
              </div>
              <br />
            </div>
            <!-- <div class="invite" v-if="this.showInviteBox">
              {{ labels.invite }} <br />

              <input
                type="text"
                :value="publicPath + $route.path"
                @click="selectAll"
                readonly="readonly"
              />
              <br />

              <button @click="closeInvite()">Close</button>
            </div> -->
          </div>
        </div>
      </div>
    </main>

    <footer>
      <br /><br />
      <section class="market-cards">
        <div class="fastaval">
          <div
            class="card"
            v-for="(item, value) in marketValues['fastaval']"
            :key="item"
            :value="value"
            :style="{
              gridTemplateRows: 'repeat(' + value + ', 1rem)',
            }"
          >
            <img src="/images/market/fastaval.png" />
          </div>
        </div>

        <div class="figures">
          <div
            class="card"
            v-for="(item, value) in marketValues['figures']"
            :key="item"
            :value="value"
            :style="{
              gridTemplateRows: 'repeat(' + value + ', 1rem)',
            }"
          >
            <img src="/images/market/figures.png" />
          </div>
        </div>
        <div class="music">
          <div
            class="card"
            v-for="(item, value) in marketValues['music']"
            :key="item"
            :value="value"
            :style="{
              gridTemplateRows: 'repeat(' + value + ', 1rem)',
            }"
          >
            <img src="/images/market/music.png" />
          </div>
        </div>
        <div class="movie">
          <div
            class="card"
            v-for="(item, value) in marketValues['movie']"
            :key="item"
            :value="value"
            :style="{
              gridTemplateRows: 'repeat(' + value + ', 1rem)',
            }"
          >
            <img src="/images/market/movie.png" />
          </div>
        </div>
        <div class="technology">
          <div
            class="card"
            v-for="(item, value) in marketValues['technology']"
            :key="item"
            :value="value"
            :style="{
              gridTemplateRows: 'repeat(' + value + ', 1rem)',
            }"
          >
            <img src="/images/market/technology.png" />
          </div>
        </div>
      </section>

      <!-- {{ players }} -->
      <!-- {{ marketValues }} -->
      <br /><br />
      <transition name="winner_style">
        <div v-if="this.showFinalScore" class="final_score">
          <br />
          <div class="winner_staffs">
            <h1 class="flicker">
              {{ players[this.winnerId].playerName }}
            </h1>

            <img
              src="/images/winner_tro.png"
              class="winner_img"
              WIDTH="349vh"
            />
          </div>
        </div>
      </transition>

      <div class="linkBox" v-if="this.showInviteBox">
        {{ labels.invite }} <br />

        <input
          type="text"
          :value="publicPath + $route.path"
          @click="selectAll"
          readonly="this.linkBoxReadOnly"
        />
        <br />

        <button @click="closeInvite()">Close</button>
      </div>

      <div class="linkBox" v-if="this.showZoomLinkBox">
        <label>Enter Zoom link in the box</label> <br />

        <input
          id="zoomLinkInput"
          type="text"
          :value="zoomLink"
          @change="updateZoomLink()"
          @click="selectAll"
        />
        <br />

        <button @click="closeInvite()">Close</button>
      </div>

      <div class="rulesBox" v-if="this.showRules">
        <embed
          src="/images/collectors.pdf"
          type="application/pdf"
          height="500px"
          width="500px"
        />

        <br />

        <button @click="closeInvite()">Close</button>
      </div>

      <!-- <p>{{ marketValues }}</p> -->
      <!-- <button v-if="players[playerId]" @click="players[playerId].money += 1">
        fake more money
      </button> -->
    </footer>
  </div>
</template>


<script>
// /eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]/;

import CollectorsCard from "@/components/CollectorsCard.vue";
import CollectorsBuyActions from "@/components/CollectorsBuyActions.vue";
import Bottles from "@/components/Bottles.vue";

export default {
  name: "Collectors",
  components: {
    CollectorsCard,
    CollectorsBuyActions,
    Bottles,
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: { x: 0, y: 0 },
      labels: {},
      players: {},

      // playerId: {
      //   hand: [],
      //   money: 1,
      //   points: 0,
      //   skills: [],
      //   items: [],
      //   income: [],
      //   secret: []
      // }

      showFinalScore: false,
      winnerId: null,
      showSendLinkPopUp: false,
      startNextRound: null,
      playersId: [],
      buyPlacement: [],
      skillPlacement: [],
      auctionPlacement: [],
      marketPlacement: [],
      workPlacement: [],
      deckAuction: [],
      cardClicked: 0,
      clickCardTimes: 0,
      recieveExtraCard: 0,
      chosenPlacementCost: null,
      marketValues: {
        fastaval: 0,
        movie: 0,
        technology: 0,
        figures: 0,
        music: 0,
      },
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      playersTurn: false,
      handClicked: 0,
      currentPlayerId: "hello",
      handCardAvailable: false,
      buttonClicked: null,
      playerid: 0,
      playerName: "",
      otherPlayers: [],
      playerBoards: {
        violet: "images/player-board-4.png",
        blue: "images/player-board-3.png",
        brown: "images/player-board-2.png",
        grey: "images/player-board-1.png",
      },
      playerBottle: {
        violet: "images/violet_bottle.png",
        blue: "images/blue_bottle.png",
        brown: "images/brown_bottle.png",
        grey: "images/grey_bottle.png",
      },
      playerColors: {
        violet: "#e19de1",
        blue: "#baf7f1",
        brown: "#dac0a4",
        grey: "#bdbfc1",
      },
      playeritem: {
        movie: 0,
        music: 0,
        technology: 0,
        figure: 0,
        fastaval: 0,
      },
      playerskill: {
        bottle: 0,
        "VP-all": 0,
        "VP-fastaval": 0,
        "VP-movie": 0,
        "VP-figures": 0,
        "VP-music": 0,
        "VP-technology": 0,
        workerCard: 0,
        workerIncome: 0,
        auctionIncome: 0,
      },
      playerState: {
        saleItems: [],
        action: "",
      },

      typeofaction: "skills",

      round: 0,

      showInviteBox: false,
      showZoomLinkBox: false,
      showRules: false,
      zoomLink: "",

      //sounds
      audioBottlePlaced: new Audio(
        "/sounds/zapsplat_household_aerosol_can_lid_down_on_wood_surface_001.mp3"
      ),
      cardMoved: new Audio(
        "/sounds/zapsplat_leisure_playing_card_turn_over_on_top_of_deck_010_39239.mp3"
      ),
      newRound: new Audio(
        "/sounds/zapsplat_multimedia_game_sound_bell_digital_synth_bright_harsh_ascend_level_up_002_40473.mp3"
      ),
      placeAuctionBid: new Audio(
        "/sounds/zapsplat_foley_money_coin_australian_10_cent_set_down_and_spin_on_tiled_table_002_28219.mp3"
      ),
      secretCardButton: new Audio(
        "/sounds/zapsplat_household_alarm_clock_button_press_12967.mp3"
      ),

      auctionStartedAudio: new Audio(
        "/sounds/PM_FN_Events_LvlUps_PowerUps_26.mp3"
      ),

      winnerSound: new Audio("/sounds/drum_roll.mp3"),
    };
  },
  computed: {
    playerId: function () {
      return this.$store.state.playerId;
    },
  },
  watch: {
    players: function (/*newP, oldP*/) {
      // console.log(Object.keys(newP).length);
      // console.log(Object.keys(oldP).length);
      // console.log(newP, oldP);
      for (let p in this.players) {
        for (let c = 0; c < this.players[p].hand.length; c += 1) {
          if (typeof this.players[p].hand[c].item !== "undefined")
            this.$set(this.players[p].hand[c], "available", false);
        }
      }
    },
  },
  created: function () {
    this.$store.commit("SET_PLAYER_ID", this.$route.query.id);
    //TODO! Fix this ugly hack
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);

    this.$store.state.socket.emit("collectorsLoaded", {
      roomId: this.$route.params.id,
      playerId: this.playerId,
    });
    this.$store.state.socket.on(
      "collectorsInitialize",
      function (d) {
        this.labels = d.labels;
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.marketValues = d.marketValues;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
        this.workPlacement = d.placements.workPlacement;
        this.deckAuction = d.deckAuction;
        this.currentPlayerId = d.currentPlayerId;
        this.round = d.round;
        this.playerState = d.playerState;
        this.startNextRound = d.startNextRound;
        this.zoomLink = d.zoomLink;
        this.playersId = d.playersId;
        // console.log("initialize startNextround: " + d.startNextRound);
        if (this.playerState.action !== "") {
          this.handlePlayerState();
        }
      }.bind(this)
    );

    this.$store.state.socket.on(
      "updateQuarter",
      function (d) {
        this.newRound.play();
        /*this.newRound1.play();*/
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.marketValues = d.marketValues;
        this.buyPlacement = d.placements.buyPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
        this.workPlacement = d.placements.workPlacement;
        this.round = d.round;
        this.deckAuction = d.deckAuction;
        this.currentPlayerId = d.currentPlayerId;
        this.startNextRound = d.startNextRound;

        /*this.start_auction = d.start_auction;*/
      }.bind(this)
    );

    this.$store.state.socket.emit("notifyPlayers", {
      roomId: this.$route.params.id,
      playerId: this.playerId,
    });

    this.$store.state.socket.on(
      "notifyPlayers",
      function (d) {
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsBottlePlaced",
      function (d) {
        console.log("collectorsBottlePlaced");
        console.log(d.players[this.playerId].money);

        this.audioBottlePlaced.play();

        /*If i comment this away they shine prmanently*/
        this.buyPlacement = d.buyPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
        this.deckAuction = d.deckAuction;

        this.workPlacement = d.workPlacement;
        this.players = d.players;
        this.currentPlayerId = d.currentPlayerId;
        console.log(
          "collectorsBottlePlaced startNextRound: " + d.startNextRound
        );
        this.startNextRound = d.startNextRound;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsHandActivated",
      function (d) {
        console.log(d);

        console.log("collectors handActiveed");

        /*  console.log(  this.players[this.playerId].hand[i].available
        this.players[this.playerId].hand = d;
        for (let c)*/
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsBottleClicked",
      function (d) {
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsPointsUpdated",
      (d) => (this.points = d)
    );

    this.$store.state.socket.on(
      "collectorsCardDrawn",
      function (d) {
        //this has been refactored to not single out one player's cards
        //better to update the state of all cards
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "updatePlayerName",
      function (d) {
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "updateZoomLink",
      function (zoomLink) {
        this.zoomLink = zoomLink;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "updatePlayerNameAuction",
      function (d) {
        this.placeAuctionBid.play();
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "nextRound",
      function (d) {
        this.round = d.round;
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsFinalScore",
      function (d) {
        this.showFinalScore = true;

        this.winnerId = d;

        this.winnerSound.play();
      }.bind(this)
    );

    this.$store.state.socket.on(
      "collectorsCardBought",
      function (d) {
        if (d.action == "auction") {
          this.auctionStartedAudio.play();
          console.log("auction started");
        } else {
          this.cardMoved.play();
        }

        console.log(d.playerId, "bought a card");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.deckAuction = d.deckAuction;
        this.marketValues = d.marketValues;
        this.deckCardAvailable = false;

        if (this.cardClicked >= this.clickCardTimes) {
          this.handCardAvailable = false;
          this.cardClicked = 0;
          this.clickCardTimes = 0;

          this.startNextRound = d.startNextRound;
        }

        /*if (this.players[this.playerId].choseSecretCard){
          this.players[this.playerId].choseSecretCard;
          this.handCardAvailable = false;

        }*/
      }.bind(this)
    );
  },
  methods: {
    displayLinkBox: function (linkType) {
      this.showInviteBox = false;
      this.showZoomLinkBox = false;

      if (linkType === "z") {
        this.showZoomLinkBox = true;
      } else if (linkType === "r") {
        this.showInviteBox = true;
      }
    },

    displayRules: function () {
      this.showInviteBox = false;
      this.showZoomLinkBox = false;
      this.showRules = true;
    },

    updateZoomLink: function () {
      let v = document.getElementById("zoomLinkInput").value;
      this.$store.state.socket.emit("updateZoomLink", {
        roomId: this.$route.params.id,
        zoomLink: v,
      });
    },

    endGame: function () {
      this.secretCardButton.play();

      var roomId = this.$route.params.id;
      this.$store.state.socket.emit("endGame", roomId);
    },

    choseSecretCard: function () {
      this.secretCardButton.play();
      this.handCardAvailable = true;
      this.players[this.playerId].choseSecretCard = false;

      /*this.players[this.playerId].choseSecretCard = false;*/
    },

    handlePlayerState: function () {
      var action = this.playerState.action;

      if (action === "buy" || action === "market") {
        this.itemsOnSale = this.playerState.saleItems;
        this.highlightCards(this.itemsOnSale);
      } else if (action === "skill") {
        this.skillsOnSale = this.playerState.saleItems;
        this.highlightCards(this.skillsOnSale);
      }
    },
    highlightCards: function (cardsToHighlight) {
      for (let i = 0; i < cardsToHighlight.length; i++) {
        this.$set(cardsToHighlight[i], "available", true);
      }
    },
    selectAll: function (n) {
      n.target.select();
    },
    setupNameChange: function () {
      if (!document.getElementById("playerNameLabel").hidden) {
        document.getElementById("playerNameLabel").hidden = true;
        document.getElementById("playerNameInputField").hidden = false;
      }
    },
    changeName: function (e) {
      if (e.keyCode === 13) {
        if (e.target.value !== "") {
          this.playerName = e.target.value;
          this.$store.state.socket.emit("updatePlayerName", {
            roomId: this.$route.params.id,
            playerId: this.$store.state.playerId,
            playerName: this.playerName,
          });
        }
        document.getElementById("playerNameLabel").hidden = false;
        document.getElementById("playerNameInputField").hidden = true;
      }
    },
    nextRound: function () {
      this.secretCardButton.play();

      alert("Are you sure you want to go to next round?");
      this.$store.state.socket.emit("nextRound", {
        roomId: this.$route.params.id,
      });
    },
    getOtherPlayerIds: function () {
      var otherPlayers = [];
      for (var id of this.playersId) {
        if (id != this.$store.state.playerId) {
          otherPlayers.push(id);
        }
      }
      // console.log("getotherplayerId");
      return otherPlayers;
    },
    getallPlayersAuction: function () {
      var allPlayers = [];

      for (var id of Object.keys(this.players)) {
        var obj = {};
        obj.id = id;
        obj.auction_amount = this.players[id].auction_amount;
        console.log(obj.id, obj.auction_amount);

        allPlayers.push(obj);
      }

      return allPlayers;
    },

    getOtherPlayersAuction: function () {
      var allPlayers = [];

      for (var id of Object.keys(this.players)) {
        if (id !== this.playerId) {
          var obj = {};
          obj.id = id;
          obj.auction_amount = this.players[id].auction_amount;
          console.log(obj.id, obj.auction_amount);

          allPlayers.push(obj);
        }
      }

      return allPlayers;
    },

    getThisPlayersAuction: function () {
      var allPlayers = [];

      for (var id of Object.keys(this.players)) {
        if (id === this.playerId) {
          var obj = {};
          obj.id = id;
          obj.auction_amount = this.players[id].auction_amount;
          console.log(obj.id, obj.auction_amount);

          allPlayers.push(obj);
        }
      }

      return allPlayers;
    },

    updatePlayerAuction: function (e, val) {
      if (e.keyCode === 13) {
        if (val === this.$store.state.playerId && e.target.value !== "") {
          this.players[this.$store.state.playerId].auction_amount =
            e.target.value;
          this.placeAuctionBid.play();

          this.$store.state.socket.emit("updatePlayerAuction", {
            roomId: this.$route.params.id,
            playerId: this.$store.state.playerId,
            auction_amount: this.players[this.$store.state.playerId]
              .auction_amount,
          });
        }
      }
    },
    placeBottle: function (action, p) {
      //button clicked(needed for CollectorsBuyActions)
      this.buttonClicked = p;

      //skill  workerCard
      if (action === "work") {
        if (this.players[this.playerId].skills.length > 0) {
          for (var i in this.players[this.playerId].skills) {
            if (this.players[this.playerId].skills[i].skill === "workerCard") {
              this.recieveExtraCard += 1;
            }
          }
        }
      }

      //decide if cards in hand should be activated/available
      if (p.cashForCard > 0) {
        this.handCardAvailable = true;
      }
      if (p.raiseValue > 0 && p.raiseValue !== undefined) {
        this.handCardAvailable = true;
      }

      //number of times cards in hand has to be clicked before beeing deactivated
      if (this.handCardAvailable) {
        this.clickCardTimes = p.clickCardTimes;
      }

      //draw cards from deck to hand
      for (let i = 0; i < p.recieveCards + this.recieveExtraCard; i += 1) {
        this.$store.state.socket.emit("collectorsDrawCard", {
          roomId: this.$route.params.id,
          playerId: this.$store.state.playerId,
        });
      }
      this.recieveExtraCard = 0;

      this.saleItems = [];
      if (action == "buy") this.saleItems = this.itemsOnSale;
      else if (action == "skill") this.saleItems = this.skillsOnSale;
      else if (action == "market") this.saleItems = this.itemsOnSale;

      this.$store.state.socket.emit("collectorsBottleClicked", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        saleItems: this.saleItems,
        action: action,
        clickedOnBottle: true,
      });

      this.chosenPlacementCost = p.cost;
      this.$store.state.socket.emit("collectorsPlaceBottle", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        p: p,
      });
    },
    drawCard: function () {
      this.$store.state.socket.emit("collectorsDrawCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
      });
    },

    getmax: function () {
      let val = this.getallPlayersAuction();
      let sortval = val.sort((a, b) => b.auction_amount - a.auction_amount);
      return sortval[0];
    },
    buyCard: function (action, d) {
      console.log("collectors buycard p: " + typeof d.p);
      this.cardClicked += 1;
      // console.log('collectors buyCard this.cardClicked: ' + this.cardClicked);

      if (action === "win_auction") {
        let max_val = this.getmax();

        if (
          max_val.id === this.playerId &&
          max_val.auction_amount >= 1 &&
          this.players[this.playerId].money >= max_val.auction_amount
        ) {
          this.players[this.playerId].start_auction = true;
          this.players[this.playerId].deckCardAvailable = false;
          this.$store.state.socket.emit("collectorsBuyCard", {
            roomId: this.$route.params.id,
            playerId: this.playerId,
            card: d.card,
            action: action,
            cost: max_val.auction_amount,
            start_auction: this.players[this.playerId].start_auction,
            deckCardAvailable: this.players[this.playerId].deckCardAvailable,
            p: d.p,
          });

          // document.getElementById("players_auction").hidden = false;
        } else {
          alert("You can't take the card , may you  need more money sorry !");
        }
      } else {
        if (action === "auction") {
          this.players[this.playerId].start_auction = false;
          this.players[this.playerId].deckCardAvailable = true;
        } else {
          this.players[this.playerId].start_auction = true;
          this.players[this.playerId].deckCardAvailable = false;
        }
        // document.getElementById("players_auction").hidden = this.start_auction;
        console.log("collectors buycard emit collectorsbuycard");
        this.$store.state.socket.emit("collectorsBuyCard", {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          card: d.card,
          action: action,
          cost: this.marketValues[d.card.market] + this.chosenPlacementCost,

          start_auction: this.players[this.playerId].start_auction,
          deckCardAvailable: this.players[this.playerId].deckCardAvailable,
          p: d.p,
        });
      }
    },

    countitem: function (items, card) {
      var count = 0;
      Object.keys(items).forEach(function (prop) {
        if (items[prop]["item"] === card) {
          count += 1;
        }
      });
      this.playeritem[card] = count;
      return count;
    },
    countskills: function (skills, card) {
      var count = 0;
      Object.keys(skills).forEach(function (i) {
        if (skills[i]["skill"] === card) {
          count += 1;
        }
      });
      this.playerskill[String(card)] = count;
      // console.log(this.playerskill[card]);
      return count;
    },
    announce_click: function () {
      this.secretCardButton.play();
      var btn = document.getElementById("auction_announce");
      btn.style.display = "none";
    },

    closeInvite: function () {
      this.secretCardButton.play();
      this.showInviteBox = false;
      this.showZoomLinkBox = false;
      this.showRules = false;
    },

    // sendLinkPopUp: function () {
    //   this.secretCardButton.play();

    //   this.showSendLinkPopUp = true;
    // },

    closeLinkPopUp: function () {
      this.secretCardButton.play();

      this.showSendLinkPopUp = false;
    },
  },
};
</script>
<style scoped>
header {
  user-select: none;
  position: fixed;
  width: 100%;
  pointer-events: none;
}
main {
  user-select: none;
}
footer {
  position: relative;
  top: 95vh;
  margin-top: 5em auto;
}
footer a {
  text-decoration: none;
  border-bottom: 2px dotted ivory;
}
footer a:visited {
  color: ivory;
}

.main-board {
  border: 1px solid rgb(37, 37, 44);

  border-radius: 20px;
  background-color: #fff;
  /* margin: 1em; */
  margin-top: 3em;
  position: absolute;
  grid-column: 1/2;
  /* top: 14vh; */
  margin-left: 3em;

  /* width: 40vw; */
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 2.5fr;
  /* grid-gap: 0.5em; */
  grid-template-rows: 1fr 4fr 1.1fr;
}

.end_game {
  position: relative;
  height: 7vh;
  width: 5vw;
  background-color: white;
  border-radius: 1vh;
  margin: 0.5vh;

  font-weight: bold;
  z-index: 5;
  float: left;
}

.end_game_alert {
  position: relative;
  height: 7vh;
  width: 10vw;
  background-color: white;
  border-radius: 1vh;

  font-weight: bold;

  box-shadow: 0 0 5vh 3vh white;
  animation: blink normal 2s infinite;
  float: left;
  margin: 0.5vh;
}

.playerboard {
  position: absolute;
  top: 40px;
  height: 100%;
  width: 100%;
  grid-column: 2/3;
}

.buy_item >>> .buy-cards {
  position: relative;
  left: 12.5vw;
  margin-top: 2.25em;
  grid-template-columns: repeat(5, 8rem);
  grid-gap: 1rem;
  transform: scale(0.6) translate(-50%, -50%);
}

.buy_skill >>> .buy-cards {
  position: relative;
  left: 8vw;
  top: -61vh;
  grid-template-rows: repeat(5, 10.5rem);
  grid-template-columns: 11rem;
  transform: scale(0.6) translate(-50%, -50%);
  transition-timing-function: ease-out;
}
::v-deep .do_auction .buy-cards {
  width: 25rem;
}

.do_auction .buy-cards {
  position: relative;
  height: 10rem;
  width: 30rem;
  /* left: -25.5vw;
  top: -35vh; */
  left: 4rem;

  display: grid;
  grid-template-columns: repeat(3, 10rem);
  grid-template-rows: repeat(2, 10rem);
  grid-gap: 20px 10px;

  transform: scale(0.6) translate(-50%, -50%);
  z-index: 5;
}

.market-cards {
  display: grid;
  grid-template-columns: repeat(5, 5.5rem);
  grid-template-rows: 3em;
  margin-left: 10em;
}

.market-cards .fastaval,
.market-cards .figures,
.market-cards .technology,
.market-cards .music,
.market-cards .movie {
  display: grid;
  grid-template-columns: 10rem;
  grid-template-rows: repeat(5, 1rem);
}

.market-cards .fastaval {
  grid-row: 1;
  grid-column: 1;
}

.market-cards .figures {
  grid-row: 1;
  grid-column: 2;
}

.market-cards .music {
  grid-row: 1;
  grid-column: 3;
}

.market-cards .movie {
  grid-row: 1;
  grid-column: 4;
}

.market-cards .technology {
  grid-row: 1;
  grid-column: 5;
}

.fastaval >>> .card {
  /* left: 17.5vw; */
  position: relative;
  top: -2vh;
  transform: scale(0.22) translate(-50%, -50%);
  z-index: 5;
}

.figures >>> .card {
  /* left: 17.5vw; */
  position: relative;
  top: -2vh;
  transform: scale(0.22) translate(-50%, -50%);
  z-index: 5;
}

.music >>> .card {
  /* left: 29.5vw; */
  position: relative;
  top: -2vh;
  transform: scale(0.22) translate(-50%, -50%);
  z-index: 5;
}

.movie >>> .card {
  position: relative;
  top: -2vh;
  transform: scale(0.22) translate(-50%, -50%);
  z-index: 5;
  /* left: 29.5vw; */
}

.technology >>> .card {
  position: relative;
  top: -2vh;
  transform: scale(0.22) translate(-50%, -50%);
  z-index: 5;
  /* left: 39.5vw; */
}
::v-deep .do_auction .buy-cards .cardslots {
  position: absolute;

  height: 10rem;
  width: 20rem;
}

::v-deep .do_auction .buy-cards .cardslots.\33 {
  position: absolute;
  grid-column: 3/4;
  grid-row: 1/2;
  grid-gap: 40px;
  z-index: 20;
}
::v-deep .do_auction .buy-cards .cardslots.\30 {
  position: absolute;
  grid-column: 1/2;
  grid-row: 2/3;
}
::v-deep .do_auction .buy-cards .cardslots.\31 {
  position: absolute;
  grid-column: 2/3;
  grid-row: 2/3;
}
::v-deep .do_auction .buy-cards .cardslots.\32 {
  position: absolute;
  grid-column: 3/4;
  grid-row: 2/3;
}

::v-deep .player-hand .cardslots .buy-cards .cardslots .card {
  position: relative;
  top: 33rem;
  left: 22rem;
  transform: scale(2) translate(-50%, -50%);
}
.item_bottle {
  background-color: rgb(219, 197, 195);
  grid-column: 2/4;
  grid-row: 1/2;
  background-image: url("/images/items.jpg");
  background-size: 100% 100%;
}
.item_bottle >>> .buttons {
  top: 5vh;
  left: 3vw;
  display: grid;
  grid-template-columns: repeat(5, 3rem);
  grid-gap: 0.5em;
}
.item_bottle >>> .button {
  width: 2rem;
  height: 2rem;
}

.skill_bottle {
  background-color: rgb(208, 226, 205);
  grid-row: 1/4;
  grid-column: 1/2;
  background-image: url("/images/skill.jpg");
  background-size: 100% 100%;
}
.skill_bottle >>> .buttons {
  top: 40vh;
  left: 2.25vw;
  display: grid;
  grid-template-rows: repeat(5, 3rem);
  grid-gap: 0.5em;
}
.market_bottle {
  grid-row: 3/4;
  grid-column: 2/4;
  background-color: rgb(171, 203, 245);
  background-image: url("/images/market.jpg");
  background-size: 100% 100%;
}

.market_bottle >>> .buttons {
  top: 1.5vh;
  left: 12.3vw;
  display: grid;
  grid-template-columns: repeat(5, 3.5rem);
  grid-gap: 0.5em;
}

.marketBottle2Blue {
  position: relative;
  z-index: 4;
  top: -5.5vh;
  left: 14.4vw;
  width: 0.5em;
  height: 0.8em;
}

.work_bottle {
  grid-column: 2/3;
  grid-row: 2/3;
  background-color: rgb(240, 228, 195);
  background-image: url("/images/work.jpg");
  background-size: 100% 100%;
}
.work_bottle >>> .buttons {
  position: relative;
  top: 16vh;
  left: 1vw;
  display: grid;
  grid-template-rows: repeat(5, 3.3rem);
  grid-gap: 0.5em;
}
.auction_bottle {
  grid-column: 3/4;
  grid-row: 2/3;
  width: 25vw;
  background-color: rgb(238, 245, 245);
  background-image: url("/images/auction.jpg");
  background-size: 100% 100%;
}

.auction_bottle >>> .buttons {
  top: 2vh;
  left: 1vw;
  width: 10vw;

  display: grid;
  grid-template-rows: repeat(5, 2.5rem);
  grid-gap: 0.5em;
  z-index: 6;
}

/* .cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 100px);
} */

.choose-secret-card {
  position: relative;
  /* left: 0.5vw;
  top: -4.5vh; */
  border: 0.4vh dashed white;
  height: 18vh;
  width: 6vw;
  border-radius: 0.5vh;
  background-color: Transparent;
  color: white;
  box-shadow: 0 0 5vh 3vh white;
  animation: blink normal 2s infinite;
  z-index: 10;
  grid-column: 1;
}

.secret-card div {
  border: dashed green;
  opacity: 0.5;
  grid-column: 1;
}

.cardslots div {
  width: 100px;
}
.secret-card div,
.cardslots div {
  transform: scale(0.3) translate(-110%, -110%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.secret-card div:hover,
.cardslots div:hover {
  transform: scale(0.7) translate(-55%, 0);
  z-index: 1;
  opacity: 1;
}

.collectors-game {
  position: absolute;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 50% 50%;
  background: rgb(92, 160, 170);
  background: linear-gradient(
    0deg,
    rgba(92, 160, 170, 1) 0%,
    rgba(189, 149, 93, 0.9920343137254902) 100%
  );

  color: #444;
  width: 100%;
  height: 100%;

  z-index: 0;
}

.game {
  font-size: 150%;
  height: 88vh;
}

.link {
  position: relative;
  font-weight: bold;
  height: 7vh;
  width: 5vw;
  background-color: white;
  border-radius: 1vh;
  margin: 0.5vh;
}

.player-board {
  border-radius: 5px;
  background-color: #444;
  color: #fff;
  position: relative;
  grid-template-rows: 10% 10% 80%;
  grid-column: 2;
  grid-row: 1;
  display: grid;
}

.current-player {
  display: grid;
  grid-template-rows: 10% 50% 20% 20%;
  background-color: #fff;
  height: 40vh;
  border-style: solid;
  border-radius: 0.5vh;
  color: black;
}

.player-details {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 30% 25% 25% 20%;
  margin-left: 0.5vh;
  margin-top: 0.5vh;
}

.player-name {
  grid-column: 1;
  grid-row: 1;
  margin-left: 0.5vh;
}

.player-coins {
  grid-column: 2;
  grid-row: 1;
}
.player-coins img {
  height: 4vh;
  /* padding-top: 5px; */
}

.player-cards-for-coins {
  grid-column: 3;
  grid-row: 1;
}

.player-cards-for-coins img {
  height: 4vh;
  /* padding-top: 5px; */
}

.player-nr-cards {
  grid-column: 4;
  grid-row: 1;
  /* width: 10vh; */
}

.player-nr-cards img {
  height: 4vh;

  /* padding-top: 5px; */
}

.player-hand {
  grid-column: 1;
  grid-row: 2;
  border-style: dashed;
  color: black;
  display: grid;
  border-radius: 1vh;
  border-width: 0.3vh;
  grid-template-columns: 15% 85%;
  margin-left: 0.5vh;
  margin-top: 1vh;
}

.player-bottles {
  grid-column: 1;
  grid-row: 3;
  display: grid;
  background-size: contain;
  background-repeat: no-repeat;
  grid-template-columns: 10% 10% 10% 10% 10%;
  margin-left: 0.5vh;
  margin-top: 1vh;
  /* gap: 7px; */
}

.player-bottles img {
  height: 100%;
}

.current-player .player-bottles img:hover {
  outline: 3px solid black;
  margin-top: 1vh;
}

.other-players .player-bottles {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  background-size: contain;
  background-repeat: no-repeat;
  grid-template-columns: 10% 10% 10% 10% 10%;
  margin-top: 1vh;
}

.player-items-skills {
  grid-row: 4;
  display: grid;
  grid-template-columns: 40% 60%;
}

.other-players .player-items-skills {
  grid-column: 1;
  grid-row: 3;
  display: grid;
  grid-template-columns: 40% 60%;
}

.player-items {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 50%;
}

.player-items-1 {
  grid-column: 1/2;
}
.player-items-2 {
  grid-column: 2/3;
}
.player-items-3 {
  grid-column: 3/4;
}
.player-items-4 {
  grid-column: 4/5;
}
.player-items-5 {
  grid-column: 5/6;
}
.player-items img {
  height: 70%;
  width: 70%;
  border-radius: 0.2rem;

  padding-top: 0.2em;
  padding-bottom: 0;
  margin: 0;
}
.other-players .player-items img {
  height: 35%;
  width: 45%;
  padding-top: 0em;
}

.player-items img:hover {
  height: 150%;
  width: 100%;
  border-radius: 0.5rem;

  outline: 1px solid rgb(221, 82, 94);
}
.player-items p {
  font-size: 0.8em;
  color: #fff;
  padding-left: 0.6em;
}

/* .other-players .player-items-1 img {
  height: 45%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 1px;
} */
.player-skills {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 0.05rem;
}

.player-skills-1 {
  grid-column: 1/2;
}
.player-skills-2 {
  grid-column: 2/3;
}
.player-skills-3 {
  grid-column: 3/4;
}
.player-skills-4 {
  grid-column: 4/5;
}
.player-skills-5 {
  grid-column: 5/6;
}
.player-skills-6 {
  grid-column: 6/7;
}
.player-skills-7 {
  grid-column: 7/8;
}
.player-skills-8 {
  grid-column: 8/9;
}
.player-skills-9 {
  grid-column: 9/10;
}
.player-skills-10 {
  grid-column: 10/11;
}

.player-skills img {
  height: 35%;
  width: 45%;
  border-radius: 0.25rem;
  padding-top: 0.12rem;

  padding-bottom: 0;
  margin: 0;
}

.other-players .player-skills img {
  height: 35%;
  width: 45%;
  border-radius: 0.25rem;
  padding-top: 0.12rem;

  padding-bottom: 0;
  margin: 0;
}

.player-skills img:hover {
  height: 100%;
  width: 100%;
  border-radius: 1rem;
  outline: 1px solid rgb(139, 204, 160);
  z-index: 2;
  position: relative;
}

.player-skills p {
  font-size: 0.8em;
  color: #fff;
  margin: 0;
  padding-left: 0.3em;
  padding-top: 0.1em;
}
.do_deckAuction >>> .buy-cards {
  position: relative;

  width: 5rem;
  height: 10rem;
  top: 4rem;
  left: 6.25rem;
}

.do_deckAuction >>> .buy-cards .cardslots {
  position: relative;
  z-index: 100;

  width: 5rem;
  height: 10rem;
  transform: scale(0.7) translate(-50%, -50%);
}
#players_auction {
  position: absolute;

  width: 6vw;
  height: 5vh;

  bottom: 93vh;
  left: 50vw;
  padding: 2px;
  margin: 2px;
  border-radius: 2rem;
  outline: 2px solid rgb(81, 85, 82);
  display: grid;
  grid-template-columns: repeat(4, 4rem);
}

.auctionPopUp {
  position: relative;
  /*height: 60vh;*/
  width: 19vw;
  top: 15vh;
  left: -25vw;

  padding: 3vh;
  line-height: 4.5vh;

  border: solid black;
  border-radius: 1vh;
  box-shadow: 0 0 50vh 10vh black;

  text-align: center;
  font-weight: bold;

  z-index: 10;

  background: rgb(245, 237, 208);
}

.auctionHeading {
  font-size: 4.5vh;

  color: black;
}

.player_1_auction {
}
.player_1_auction label {
  display: inline-block;
  vertical-align: middle;
  padding: 0.2rem;
  width: 3vw;
  color: rgb(126, 42, 42);
}

.player_1_auction input {
  display: inline-block;
  vertical-align: middle;

  width: 20px;
  font-size: 1em;

  /*color: LimeGreen;*/
  color: red;
}

/* .other-players .player-skills-1 img {
  height: 45%;
  width: 100%;
  padding-top: 1px;
  padding-bottom: 1px;
} */

.other-players {
  display: grid;
  grid-gap: 3px;
  grid-template-rows: 20% 40% 40%;
  background-color: #fff;
  height: 16vh;
  color: black;
  border: solid black;
  border-top: 0;
  border-radius: 0.5vh;
}

p {
  margin-top: 0em;
}

#nameChangeImg:hover {
  outline: 2px solid white;
}

@media screen and (max-width: 800px) {
  main {
    width: 70vw;
  }
}

.quarter-tiles {
  position: relative;
  top: -8em;
  left: 0.1em;
  width: 5.5em;
  height: 2.5em;
  background-size: 100% 100%;
  border-radius: 5px;

  /* border:none; */
}

@-moz-keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.player_avatar {
  position: relative;
  /* right: -110rem;
  top: 0.5rem; */

  height: 7vh;
  width: 4vw;
  float: right;
  right: 1.5rem;
  border-radius: 0.5rem;

  border: 3px solid rgb(247, 247, 144);
}
.avatar {
  animation: blink normal 2s infinite cubic-bezier(1, -0.49, 0.1, 1.15);
}
.your_turn {
  position: relative;
  right: -101.5rem;
  top: -4.5rem;
}

#auction_announce {
  position: relative;
  top: -70rem;
  left: -30rem;
  /* "this.style.display='none'" */
  box-shadow: 0 0 90px black;
  height: 10rem;
  width: 20rem;
  z-index: 20;
}

.choose-secret-card {
  position: relative;
  left: 0.5vw;

  border: 0.4vh dashed white;
  height: 18vh;
  width: 6vw;
  border-radius: 0.5vh;
  background-color: Transparent;
  color: white;
  box-shadow: 0 0 5vh 3vh white;
  animation: blink normal 2s infinite;
  z-index: 10;
}

.linkBox {
  /* color: black;
  position: relative;
  z-index: 10;
  padding: 3vh;
  line-height: 5vh;
  background-color: white;
  width: 20vw;
  border: 0.4vh solid;
  border-radius: 1vh;
  text-align: center;
  font-weight: bold; */

  position: relative;
  height: 20vh;
  width: 20vw;
  top: -90vh;
  left: 35vw;
  padding: 3vh;
  line-height: 5vh;

  border: solid black;
  border-radius: 1vh;

  text-align: center;
  font-weight: bold;

  z-index: 5;
  background: white;
  color: black;
}

.rulesBox {
  position: relative;
  height: 550px;
  width: 500px;
  top: -100vh;
  left: 35vw;
  padding: 3vh;
  line-height: 5vh;

  z-index: 5;

  border: solid black;
  border-radius: 1vh;

  text-align: center;
  font-weight: bold;

  background: white;
  color: black;
}

.next_round {
  position: relative;
  font-weight: bold;
  height: 7vh;
  width: 5vw;

  background-color: white;
  border-radius: 1vh;
  margin: 0.5vh;

  z-index: 5;

  float: left;
}

.next_round_alert {
  position: relative;
  font-weight: bold;
  height: 7vh;
  width: 8vw;
  background-color: white;
  border-radius: 1vh;
  margin: 0.5vh;

  box-shadow: 0 0 5vh 3vh white;
  animation: blink normal 2s infinite;

  z-index: 5;

  float: left;
}

.upperRightButtons {
  grid-row: 1;
}

.players-block {
  grid-row: 2;
}
.winner_style-enter-active {
  animation: bounceIn 5s;
}
@keyframes bounceIn {
  0% {
    transform: scale(0.1);
    opacity: 0;
  }
  20% {
    transform: scale(2);
    opacity: 1;
  }
  40% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  60% {
    transform: scale(1.5);
    opacity: 1;
  }
  80% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
  }
}

/* .sendLinkPopUp {
  position: center;
  height: 60vh;
  width: 19vw;
  padding: 3vh;
  line-height: 5vh;

  border: solid black;
  border-radius: 1vh;

  text-align: center;
  font-weight: bold;

  z-index: 30;

  background: white;
} */

.final_score {
  position: relative;
  height: 250vh;
  width: 250vh;
  top: -180vh;
  left: -20rem;

  line-height: 5vh;

  border-radius: 50%;

  text-align: center;
  font-weight: bold;

  z-index: 5;

  background: rgb(5, 4, 0);
  background: rgb(5, 4, 0);
  background: radial-gradient(
    circle,
    rgb(24, 19, 2) 20%,
    rgba(125, 121, 138, 0) 100%
  );
  color: rgb(247, 242, 242);
}
.winner_staffs {
  position: relative;
  top: 85vh;
}
.flicker {
  animation: shine 2s forwards, blink 1s infinite;
  font-size: 5rem;
}

@keyframes shine {
  0% {
    color: #6b1839;
    text-shadow: none;
  }
  100% {
    color: #ffe6ff;
    text-shadow: 0 0 0.6rem #ffe6ff, 0 0 1.5rem #ff6565,
      -0.2rem 0.1rem 1rem #ff6565, 0.2rem 0.1rem 1rem #ff656d,
      0 -0.5rem 2rem #ff2483, 0 0.5rem 3rem #ff2483;
  }
}

@keyframes flicker {
  from {
    opacity: 1;
  }

  4% {
    opacity: 0.9;
  }

  6% {
    opacity: 0.85;
  }

  8% {
    opacity: 0.95;
  }

  10% {
    opacity: 0.9;
  }

  11% {
    opacity: 0.922;
  }

  12% {
    opacity: 0.9;
  }

  14% {
    opacity: 0.95;
  }

  16% {
    opacity: 0.98;
  }

  17% {
    opacity: 0.9;
  }

  19% {
    opacity: 0.93;
  }

  20% {
    opacity: 0.99;
  }

  24% {
    opacity: 1;
  }

  26% {
    opacity: 0.94;
  }

  28% {
    opacity: 0.98;
  }

  37% {
    opacity: 0.93;
  }

  38% {
    opacity: 0.5;
  }

  39% {
    opacity: 0.96;
  }

  42% {
    opacity: 1;
  }

  44% {
    opacity: 0.97;
  }

  46% {
    opacity: 0.94;
  }

  56% {
    opacity: 0.9;
  }

  58% {
    opacity: 0.9;
  }

  60% {
    opacity: 0.99;
  }

  68% {
    opacity: 1;
  }

  70% {
    opacity: 0.9;
  }

  72% {
    opacity: 0.95;
  }

  93% {
    opacity: 0.93;
  }

  95% {
    opacity: 0.95;
  }

  97% {
    opacity: 0.93;
  }

  to {
    opacity: 1;
  }
}
.winner_img {
  animation: spinne 1s infinite;
}
@keyframes spinne {
  from {
    transform: rotate(0deg);
  }

  9% {
    transform: rotate(-10deg);
  }

  18% {
    transform: rotate(-20deg);
  }

  27% {
    transform: rotate(-30deg);
  }

  36% {
    transform: rotate(-20deg);
  }

  45% {
    transform: rotate(-10deg);
  }

  54% {
    transform: rotate(0deg);
  }

  63% {
    transform: rotate(10deg);
  }

  72% {
    transform: rotate(20deg);
  }

  81% {
    transform: rotate(30deg);
  }

  90% {
    transform: rotate(20deg);
  }

  99% {
    transform: rotate(10deg);
  }

  to {
    transform: rotate(0deg);
  }
}
</style>
