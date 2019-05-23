const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Table = require('./Table')

class BlackJackGame {
  constructor () {
    this.deck = new Deck()
    this.dealer = new Dealer()
    this.table = new Table()
    this.players = this.table.players
  }

  dealCards() {
    for(let i in this.players) {
      this.players[i].hand.push(this.deck.dealCard(),this.deck.dealCard())
      console.log(this.players[i].hand)
    }
    this.dealer.hand.push(this.deck.dealCard(),this.deck.dealCard()) 
    console.log(this.dealer.hand)
  }
}

module.exports = BlackJackGame
