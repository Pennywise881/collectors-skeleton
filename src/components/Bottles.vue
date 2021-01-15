<template>
  <div class="buttons">
    <div v-for="(p, index) in placement" :key="index">
      <div v-if="p.bottleType == 'normal'">
        <button
          class="btn-normal"
          v-if="p.playerId === null"
          :disabled="cannotAfford(p.cost)"
          @click="placeBottle(p)"
        >
          <div class="recieveMoney" v-if="p.cost < 0">${{ p.cost * -1 }}</div>

          <div class="costMoney" v-if="p.cost >= 0">${{ p.cost }}</div>
        </button>
      </div>

      <div v-if="p.bottleType == 'marketTwoBlue'">
        <button
          class="btn-marketTwoBlue"
          v-if="p.playerId === null"
          :disabled="cannotAfford(p.cost)"
          @click="placeBottle(p)"
        >
          <div class="recieveMoney" v-if="p.cost < 0">${{ p.cost * -1 }}</div>

          <div class="costMoney" v-if="p.cost >= 0">${{ p.cost }}</div>
        </button>
      </div>

      <div v-if="p.bottleType == 'marketOneBlue'">
        <button
          class="btn-marketOneBlue"
          v-if="p.playerId === null"
          :disabled="cannotAfford(p.cost)"
          @click="placeBottle(p)"
        >
          <div class="recieveMoney" v-if="p.cost < 0">${{ p.cost * -1 }}</div>

          <div class="costMoney" v-if="p.cost >= 0">${{ p.cost }}</div>
        </button>
      </div>

      <div v-if="p.bottleType == 'marketDollar'">
        <button
          class="btn-marketDollar"
          v-if="p.playerId === null"
          :disabled="cannotAfford(p.cost)"
          @click="placeBottle(p)"
        >
          <div class="recieveMoney" v-if="p.cost < 0">${{ p.cost * -1 }}</div>

          <div class="costMoney" v-if="p.cost >= 0">${{ p.cost }}</div>
        </button>
      </div>

      <div v-if="p.bottleType == 'auctionMedal'">
        <button
          class="btn-auctionMedal"
          v-if="p.playerId === null"
          :disabled="cannotAfford(p.cost)"
          @click="placeBottle(p)"
        >
          <div class="recieveMoney" v-if="p.cost < 0">${{ p.cost * -1 }}</div>

          <div class="costMoney" v-if="p.cost >= 0">${{ p.cost }}</div>
        </button>
      </div>

      <div v-if="p.playerId !== null">
        <img class="bottlePlaced" :src="playerBottle[p.color]" alt="bottle" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bottles",

  data: function () {
    return {
      playerBottle: {
        violet: "images/violet_bottle.png",
        blue: "images/blue_bottle.png",
        brown: "images/brown_bottle.png",
        grey: "images/grey_bottle.png",
      },
    };
  },

  props: {
    labels: Object,
    player: Object,
    itemsOnSale: Array,
    typeofaction: String,

    marketValues: Object,
    placement: Array,
  },
  methods: {
    isAvailableCards: function (card, cost) {
      if (this.marketValues[card.item] <= this.player.money - cost) {
        this.$set(card, "available", true);
      } else {
        this.$set(card, "available", false);
      }
    },
    cannotAfford: function (cost) {
      let minCost = 100;
      for (let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key];
      }
      return this.player.money < minCost;
    },
    cardCost: function (card) {
      return this.marketValues[card.market];
    },
    placeBottle: function (p) {
      if (!this.player.playersTurn) {
        alert("Wait for your turn to play");
      }
      if (
        this.player.money >= p.cost &&
        this.player.bottles > 0 &&
        this.player.playersTurn
      ) {
        if (this.itemsOnSale !== undefined) {
          this.highlightAvailableCards(p.cost);
        }

        this.$emit("placeBottle", p);
      }
      /*if (this.player.playersTurn){
          console.log('Bottles emit placeBottle');
          this.$emit("placeBottle", p);

          if (this.itemsOnSale !== undefined){
            this.highlightAvailableCards(p.cost);
          }

        }*/
    },
    highlightAvailableCards: function (cost = 100) {
      for (let i = 0; i < this.itemsOnSale.length; i += 1) {
        this.isAvailableCards(this.itemsOnSale[i], cost);
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.isAvailableCards(this.player.hand[i], cost);
      }
    },

    cardsInHand: function (card) {
      this.$set(card, "available", true);
    },

    buyCard: function (card) {
      if (card.available) {
        this.$emit("buyCard", card);
        this.highlightAvailableCards();
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.buy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}
.buttons {
  position: relative;
  z-index: 6;
}

.cardslots div {
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.btn-normal {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/bottle.jpg");
}

.btn-marketTwoBlue {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/marketBottle2Blue.jpg");
}

.btn-marketOneBlue {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/marketBottle1Blue.jpg");
}

.btn-marketDollar {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/marketBottleDollar.jpg");
}

.btn-auctionMedal {
  width: 5em;
  height: 5em;
  background-size: 100% 100%;
  border-radius: 5px;

  padding: 0.5rem;
  font-size: 0.5rem;
  background-image: url("/images/auctionBottleMedal.jpg");
}
.bottlePlaced {
  width: 3.3vw;
  height: 6vh;
  border-radius: 5px;
  background-size: 100% 100%;
}
.recieveMoney {
  color: LimeGreen;
  text-indent: -2.8em;
  font-weight: 900;
}
.costMoney {
  color: black;
  text-indent: -2.8em;
  font-weight: 900;
}
</style>
