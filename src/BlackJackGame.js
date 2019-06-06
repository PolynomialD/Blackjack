const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Player = require('./Player')

class BlackJackGame {
  constructor (deck) {
    this.deck = deck || new Deck()
    this.dealer = new Dealer()
    this.players = []
    this.bets = []
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

  takeBets() {
    this.players.forEach((player) => {
      this.bets.push(player.getBets())
    })
  }

  handValue(hand) {
    return hand.sort((a, b) => a.value - b.value).reduce((total, card) => {
      if(card.face.includes('A') && total + card.value > 21) {
        return total + 1
      }
      return total + card.value
    }, 0)
  }

  playDealersHand() {
    while(this.handValue(this.dealer.hand.cards) < 17) {
      this.dealer.receiveCard(this.deck.dealCard())
    }
  }

payWinners() {
  const dealerHandValue = this.handValue(this.dealer.hand.showCards())
  this.players.forEach((player) => {
    const playerHandValue = this.handValue(player.hands[0].showCards())
    if(playerHandValue < 22 && playerHandValue > dealerHandValue) {
      player.receiveChips(player.getBets()[0] * 2)
      player.removeBet()
    } else {
      player.removeBet()
    }
  })
}

}

module.exports = BlackJackGame
