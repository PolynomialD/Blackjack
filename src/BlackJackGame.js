const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Player = require('./Player')

class BlackJackGame {
  constructor () {
    this.deck = new Deck()
    this.dealer = new Dealer()
    this.players = []
  }

  dealCards(amountToDeal = 2) {
    for (amountToDeal; amountToDeal > 0; amountToDeal--) {
      this.players.forEach((player) => {
        player.receiveCard(this.deck.dealCard())
      })
      this.dealer.receiveCard(this.deck.dealCard())
    }
  }

  addPlayer(name, chips) {
    this.players.push(new Player(name, chips))
  }

  getNumberOfPlayers() {
    return this.players.length
  }
}

module.exports = BlackJackGame
