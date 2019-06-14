const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Player = require('./Player')

class BlackJackGame {
  constructor (deck, players) {
    this.deck = deck || this.createBlackJackDeck()
    this.dealer = new Dealer()
    this.players = players || []
  }

  createBlackJackDeck() {  
    return new Deck(['♣','♦','♥','♠','♣','♦','♥','♠','♣','♦','♥','♠','♣','♦','♥','♠'])
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
    const player = new Player(name, chips)
    this.players.push(player)
    return player
  }

  getNumberOfPlayers() {
    return this.players.length
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
    while(this.handValue(this.dealer.showHand()) < 17) {
      this.dealer.receiveCard(this.deck.dealCard())
    }
  }

  payWinners() {
    const dealerHandValue = this.handValue(this.dealer.showHand())
    this.players.forEach((player) => {
      player.hands.forEach((hand) => {
        const playerHandValue = this.handValue(hand.showCards())
        if(playerHandValue < 22 && playerHandValue > dealerHandValue) {
          player.receiveChips(this.dealer.giveChips(player.getBets()[0]))
          player.receiveChips(player.removeBet())            
        } else if(playerHandValue < 22 && dealerHandValue > 21) {
          player.receiveChips(this.dealer.giveChips(player.getBets()[0]))
          player.receiveChips(player.removeBet())
        } else {
          this.dealer.receiveChips(player.removeBet())
        }
      })
    })
  }

}

module.exports = BlackJackGame
