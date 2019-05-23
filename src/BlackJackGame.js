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
      // console.log(this.players[i].hand)
    }
    this.dealer.hand.push(this.deck.dealCard(),this.deck.dealCard()) 
    // console.log(this.dealer.hand)
  }
  dealerHandValue() {
    const hand = this.dealer.hand
    return this.handValue(hand)
  }

  playerHandValue(player) {
    const hand = this.players[player-1].hand
    return this.handValue(hand)
  }

  handValue(hand) {
    let handValue = 0
    for(let card in hand) {
      let cardValue = hand[card].value
      if (cardValue === 'A') {
        handvalue += 11
      } else if(cardValue < 10) {
        handValue += cardValue
      } else { 
        handValue += 10
      }
    }
    return handValue
  }
}

module.exports = BlackJackGame
