const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Player = require('./Player')
const Logger = require('./Logger')

class BlackJackGame {
  constructor (deck, players) {
    this.deck = deck || this.createBlackJackShoe()
    this.dealer = new Dealer()
    this.players = players || []
    this.currentPlayer = 0
    this.round = 1
    this.betCount = 0
    this.history = []
    this.logger = new Logger()
  }

  addRoundToHistory() {
    this.history.push({
      round: this.round,
      players: this.players.map((player) => {
        return {
          name: player.getName(),
          chips: player.getChips() + player.getBets().reduce((total, num) => {
            return total + num}) + player.getInsuranceBet(),
          hands: player.showHands(),
          bets: (player.getBets().length === 2) ? [player.getBets()[0], player.getBets()[1]] : [player.getBets()[0]]
        }
      })
    })
  }

  getCardCount() {
    let cardCount = 0
    this.deck.showDealtCards().forEach((card) => {
      if(card.value < 7) {
        cardCount++
      } else if(card.value > 9) {
        cardCount--
      }
    })
    return cardCount
  }

  getBetCount() {
    return this.betCount
  }

  addBetToCount() {
    this.betCount++
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
    this.betCount = 0
    this.currentPlayer = 0
    if(this.deck.size() < (this.getNumberOfPlayers()+1) * 8) {
      this.deck = this.createBlackJackShoe()
      this.deck.shuffle()
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

  drawCard(hand) {
    const player = this.players[this.currentPlayer]
    const card = this.deck.dealCard()

    player.receiveCard(card, hand)
    if(player.handValue(hand) > 21) {
      player.stick(hand)
      this.logger.log(`${player.getName()} goes bust!`)
    }
  }

  stick(hand) {
    const player = this.players[this.currentPlayer]
    this.logger.log(`${player.getName()} sticks on ${player.handValue(hand)}`)
    player.stick(hand)
  }

  doubleDown() {
    const player = this.players[this.currentPlayer]
    player.doubleBet()
    this.drawCard(0)
    player.stick(0)
  }

  splitHand() {
    const player = this.players[this.currentPlayer]

    player.splitHand()
    this.drawCard(0)
    this.drawCard(1)
    this.logger.log(`${player.name} shows ${player.displayCards()}`)
    if(player.showHand(0)[0].value === 11 && player.showHand(1)[0].value === 11) {
      player.stick(0)
      player.stick(1)
    }
  }

  changeCardColour() {
    this.deck.changeCardColour()
  }

  createBlackJackShoe(decks = 6) {
    this.cardCount = 0
    const suits = []
    for(decks; decks>0; decks--) {
      suits.push('♣','♦','♥','♠')
    }
    return new Deck(suits)
  }

  dealCards(amountToDeal = 2) {
    for(amountToDeal; amountToDeal > 0; amountToDeal--) {
      this.players.forEach((player) => {
        const card = this.deck.dealCard()
        player.receiveCard(card, 0)
      })
      this.dealer.receiveCard(this.deck.dealCard())
    }
    this.logHands()
  }

  logHands () {
    this.logger.log(`Dealer shows [?, ${this.dealer.showHand()[1].face}]`)
    this.players.forEach((player) => {
      this.logger.log(`${player.name} shows ${player.displayCards()}`)
    })
  }

  addPlayer(name, chips) {
    const player = new Player(name, chips, this.logger)
    this.players.push(player)
    this.logger.log(`${player.getName()} joins the table`)
    return this.players[this.players.length-1]
  }

  removePlayer(index) {
    this.players.splice(index,1)
  }

  getNumberOfPlayers() {
    return this.players.length
  }

  playDealersHand() {
    while(this.dealer.hands[0].value() < 17) {
      this.dealer.receiveCard(this.deck.dealCard())
    }
  }

  payWinners() {
    const dealerHandValue = this.dealer.hands[0].value()
    this.players.forEach((player) => {
      if(this.dealer.hasBlackJack()) {
        player.receiveChips(this.dealer.giveChips(player.removeInsuranceBet() * 2))
      } else player.removeInsuranceBet()

      player.hands.forEach((hand) => {
        const playerHandValue = hand.value()
        if(player.hasBlackJack(0) && player.getHandAmount() === 1) {
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
