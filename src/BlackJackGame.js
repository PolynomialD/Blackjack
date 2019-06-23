const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Player = require('./Player')

class BlackJackGame {
  constructor (deck, players) {
    this.deck = deck || this.createBlackJackDeck()
    this.dealer = new Dealer()
    this.players = players || []
    this.currentPlayer = 0
    this.round = 1
  }

  getCurrentPlayer() {
    return this.currentPlayer
  }

  getRound() {
    return this.round
  }

  nextPlayer() {
    this.currentPlayer++
  }

  nextRound() {
    this.round++
    this.currentPlayer = 0
    if(this.deck.size() < (this.getNumberOfPlayers()+1) * 8) {
      this.deck = this.createBlackJackDeck()
      window.alert('new cards!')
    }
    this.dealer.discardHand()
    this.players.forEach((player) => {
      player.discardHands()
    })
    this.players.forEach((player, index) => {
      if(player.getChips() === 0) {
        this.removePlayer(index)
      }
    })
  }

  splitHand() {
    this.players[this.currentPlayer].splitHand()
    this.players[this.currentPlayer].receiveCard(this.deck.dealCard(),0)
    this.players[this.currentPlayer].receiveCard(this.deck.dealCard(),1)
  }

  getPlayersChipsAndBets() {
    return this.players.map((player) => {
      return player.getChips() + player.getBets().reduce((total,number) => {
        return total + number
      })
    })
  }

  changeCardColour() {
    this.deck.changeCardColour()
  }

  createBlackJackDeck(decks = 6) {
    const suits = []
    for(decks; decks>0; decks--) {
      suits.push('♣','♦','♥','♠')
    }
    return new Deck(suits)
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

  removePlayer(index) {
    this.players.splice(index,1)
  }

  getNumberOfPlayers() {
    return this.players.length
  }

  handValue(hand) {
    const clone = JSON.parse(JSON.stringify(hand))
    return clone.sort((a, b) => a.value - b.value).reduce((total, card) => {
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
        if(playerHandValue === 21 && hand.size() === 2 && player.hands.length === 1) {
          player.receiveChips(this.dealer.giveChips(player.getBets()[0] + player.getBets()[0]/2))
          player.receiveChips(player.removeBet())
          hand.setResult('win')
        } else if(playerHandValue === 21 && hand.size() === 2 ) {
          player.receiveChips(this.dealer.giveChips(player.getBets()[0]))
          player.receiveChips(player.removeBet())
          hand.setResult('win')
        } else if(playerHandValue < 22 && playerHandValue === dealerHandValue) {
          player.receiveChips(player.removeBet())
          hand.setResult('draw')
        } else if(playerHandValue < 22 && playerHandValue > dealerHandValue) {
          player.receiveChips(this.dealer.giveChips(player.getBets()[0]))
          player.receiveChips(player.removeBet())
          hand.setResult('win')
        } else if(playerHandValue < 22 && dealerHandValue > 21) {
          player.receiveChips(this.dealer.giveChips(player.getBets()[0]))
          player.receiveChips(player.removeBet())
          hand.setResult('win')
        } else {
          this.dealer.receiveChips(player.removeBet())
          hand.setResult('lose')
        }
      })
    })
  }

}

module.exports = BlackJackGame
