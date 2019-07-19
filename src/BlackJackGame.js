const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Player = require('./Player')
const Logger = require('./Logger')
const Strategy = require('./Strategy')

class BlackJackGame {
  constructor (deck, players) {
    this.deck = deck || this.createBlackJackShoe()
    this.dealer = new Dealer()
    this.players = players || []
    this.currentPlayerIndex = 0
    this.round = 1
    this.betCount = 0
    this.logger = new Logger()
  }

  checkOptimalMove(hand, move) {
    const player = this.getCurrentPlayer()
    const dealerCardValue = this.dealer.hands[0].cards[1].value
    const playerValue = player.adjustedHandValue(hand)
    let optimalMove = new Strategy().correctMove(dealerCardValue, playerValue)

    if((player.hands[hand].size() !== 2 || player.getHandAmount() !== 1) && optimalMove === 'double down') {
      optimalMove = 'card'
    }
    return move === optimalMove
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

  getCurrentPlayerIndex() {
    return this.currentPlayerIndex
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  getRound() {
    return this.round
  }

  nextPlayer() {
    this.currentPlayerIndex++
  }

  nextRound() {
    this.round++
    this.betCount = 0
    this.currentPlayerIndex = 0
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
    this.players[this.currentPlayerIndex].receiveCard(this.deck.dealCard(), hand)
  }

  doubleDown() {
    const player = this.players[this.currentPlayerIndex]
    player.doubleBet()
    this.drawCard(0)
    player.doubleDown()
  }

  splitHand() {
    const player = this.players[this.currentPlayerIndex]
    player.splitHand()
    this.drawCard(0)
    this.drawCard(1)
    this.logger.log(`${player.name} shows ${player.displayCards()}`)
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

  logWinnings() {
    this.players.forEach((player) => {
      if(player.winnings > 0) {
        this.logger.log(`${player.name} wins ${player.winnings}`)
      } else if(player.winnings < 0) {
        this.logger.log(`${player.name} loses ${player.winnings}`)
      } else {
        this.logger.log(`${player.name} breaks even`)
      }
    })
  }

  addPlayer(name, chips, logger = this.logger) {
    const player = new Player(name, chips, logger)
    this.players.push(player)
    logger.log(`${player.getName()} joins the table`)
    return this.players[this.players.length-1]
  }

  removePlayer(index) {
    this.players.splice(index,1)
  }

  getNumberOfPlayers() {
    return this.players.length
  }

  playDealersHand() {
    while(this.dealer.handValue() < 17) {
      this.dealer.receiveCard(this.deck.dealCard())
    }
    if(this.dealer.hands[0].trueValue() === 'soft 17') {
      this.dealer.receiveCard(this.deck.dealCard())      
    }
  }

  payWinners() {
    const dealerHandValue = this.dealer.handValue()
    this.players.forEach((player) => {
      if(this.dealer.hasBlackJack()) {
        this.payInsuranceBet(player)
      } else this.dealer.receiveChips(player.removeInsuranceBet())

      player.hands.forEach((hand, i) => {
        const playerHandValue = hand.value()
        if(player.hasBlackJack(0) && player.getHandAmount() === 1) {
          this.payBlackJack(player)
          this.removeBet(player)
          hand.setResult('win')
        } else if(player.hasBlackJack(i) ) {
          this.PayBetAmount(player)
          this.removeBet(player)
          hand.setResult('win')
        } else if(playerHandValue < 22 && playerHandValue === dealerHandValue) {
          this.removeBet(player)
          hand.setResult('draw')
        } else if(playerHandValue < 22 && playerHandValue > dealerHandValue) {
          this.PayBetAmount(player)
          this.removeBet(player)
          hand.setResult('win')
        } else if(playerHandValue < 22 && dealerHandValue > 21) {
          this.PayBetAmount(player)
          this.removeBet(player)
          hand.setResult('win')
        } else {
          this.dealer.receiveChips(player.removeBet())
          hand.setResult('lose')
        }
      })
    })
  }

  removeBet(player) {
    player.receiveChips(player.removeBet())
  }

  PayBetAmount(player) {
    player.receiveChips(this.dealer.giveChips(player.getBets()[0]))
  }

  payInsuranceBet(player) {
    player.receiveChips(this.dealer.giveChips(player.removeInsuranceBet() * 2))
  }

  payBlackJack(player) {
    player.receiveChips(this.dealer.giveChips(player.getBets()[0] + player.getBets()[0]/2))
  }
}

module.exports = BlackJackGame
