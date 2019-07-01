const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Player = require('./Player')
const Logger = require('./Logger')

class BlackJackGame {
  constructor (deck, players) {
    this.deck = deck || this.createBlackJackDeck()
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
      this.deck = this.createBlackJackDeck()
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
    this.logger.log(`${player.getName()} draws ${card.face}`)

    if(this.handValue(player.showHand(hand)) > 21) {
      player.stick(hand)
      this.logger.log(`${player.getName()} goes bust!`)
    }
  }

  stick(hand) {
    const player = this.players[this.currentPlayer]
    this.logger.log(`${player.getName()} sticks on ${this.handValue(player.showHand(hand))}`)
    player.stick(hand)
  }

  doubleDown() {
    const player = this.players[this.currentPlayer]
    const bet = player.removeBet()

    this.logger.log(`${player.getName()} doubles down`)
    player.receiveChips(bet)
    player.placeBet(Number(bet * 2))
    this.drawCard(0)

    player.stick(0)
  }

  splitHand() {
    const player = this.players[this.currentPlayer]

    player.splitHand()
    this.drawCard(0)
    this.drawCard(1)

    if(player.showHand(0)[0].value === 11 && player.showHand(1)[0].value === 11) {
      player.stick(0)
      player.stick(1)
    }
  }

  changeCardColour() {
    this.deck.changeCardColour()
  }

  createBlackJackDeck(decks = 6) {
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
        this.logger.log(`${player.getName()} is dealt ${card.face}`)
      })
      this.dealer.receiveCard(this.deck.dealCard())
    }
    this.logger.log(`the dealer shows ${this.dealer.showHand()[1].face}`)
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
      if(dealerHandValue === 21 && this.dealer.handSize() === 2 && player.getInsuranceBet() !== 0) {
        player.receiveChips(this.dealer.giveChips(player.removeInsuranceBet() * 2))
      } else if(player.getInsuranceBet() !== 0) {
        player.removeInsuranceBet()
      }
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
