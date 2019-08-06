const Hand = require('./Hand')

class Player {
  constructor (name, chips, logger) {
    this.name = name.toString()
    this.hands = [new Hand()]
    this.chips = chips
    this.bets = []
    this.insuranceBet = 0
    this.winnings = 0
    this.logger = logger
    this.combo = 0
    this.medals = []
  }

  getCombo() {
    return this.combo
  }

  resetCombo() {
    this.combo = 0
  }

  increaseCombo() {
    this.combo += 1
  }

  checkForGold() {
    if(this.combo > 49) {
      this.medals.push('gold')
      this.resetCombo()
    }
  }

  checkForMedal() {
    if(this.combo > 2 && this.combo < 20) {
      this.medals.push('bronze')
    } else if(this.combo > 19 && this.combo < 50) {
      this.medals.push('silver')
    }
  }

  getMedals() {
    return this.medals
  }

  canBetAgain() {
    return this.chips >= this.bets[0]
  }

  canHalfBetAgain() {
    return this.chips >= this.bets[0]/2
  }

  stick(hand) {
    this.hands[hand].completeHand()
    this.logger.log(`${this.getName()} sticks on ${this.handValue(hand)}`)
  }

  getStatus() {
    if(this.getHandAmount() === 1 && this.hands[0].isComplete()) {
      return 'done'
    } else if(this.getHandAmount() === 2) {
      if(this.hands[0].isComplete() && this.hands[1].isComplete()) {
        return 'done'
      }
    } else return 'playing'
  }

  getHandResult(hand) {
    const result = this.hands[hand].getResult()
    this.logger.log(`${this.name} ${result}s with ${this.displayCards()[hand]}`)
    return result
  }

  getBets() {
    return this.bets
  }

  getInsuranceBet() {
    return this.insuranceBet
  }

  removeBet() {
    this.winnings -= this.bets[0]
    return this.bets.pop()
  }

  doubleBet() {
    const bet = this.bets[0]
    const newBet = bet * 2
    this.logger.log(`${this.name} doubles bet to ${newBet}`)
    this.bets[0] = newBet
    this.chips -= bet
  }

  doubleDown() {
    this.hands[0].completeHand()
    if(this.handValue(0) < 22) {
      this.logger.log(`${this.name} sticks on ${this.handValue(0)}`)
    }
  }

  removeInsuranceBet() {
    const bet = this.insuranceBet
    this.insuranceBet = 0
    this.winnings -= bet
    return bet
  }

  getChips() {
    return this.chips
  }

  getName() {
    return this.name
  }

  getHandAmount() {
    return this.hands.length
  }

  receiveChips(amount) {
    this.logger.log(`${this.name} receives ${amount}`)
    this.chips += amount
    this.winnings += amount
  }

  placeBet(bet) {
    const chips = this.chips
    if(bet > 0 && bet <= chips) {
      this.chips -= bet
      this.logger.log(`${this.name} bets ${bet}`)
      this.bets.push(bet)
    } else if(bet > chips) {
      this.logger.log(`${this.name} bets ${chips}`)
      this.bets.push(chips)
      this.chips = 0
    } 
  }

  placeInsuranceBet() {
    const chips = this.chips
    const halfBet = this.bets[0]/2
    if(chips > halfBet) {
      this.logger.log(`${this.name} insurance bets ${halfBet}`)
      this.chips -= halfBet
      this.insuranceBet = halfBet
    }
  }

  showHand(hand = 0) {
    return this.hands[hand].showCards()
  }

  showHands() {
    return this.hands.map((hand) => hand.showCards())
  }

  handValue(hand = 0) {
    return this.hands[hand].value()
  }

  handSize(hand = 0) {
    return this.hands[hand].size()
  }

  splitHand() {
    const hand = this.hands[0]

    if(hand.isSplittable() && this.canBetAgain()) {
      const newHands = hand.split()
      this.hands[0] = newHands[0]
      this.hands.push(newHands[1])
      this.logger.log(`${this.name} splits the hand`)
      this.placeBet(this.bets[0])
      if(this.showHand(0)[0].value === 11 && this.showHand(1)[0].value === 11) {
        this.hands[0].completeHand()
        this.hands[1].completeHand()
      }
    }
  }

  displayCards () {
    return this.hands.map((hand) => {
      return `[${hand.showCards().map((card) => card.face)}]`
    })
  }

  discardHands() {
    this.hands = [new Hand()]
    this.winnings = 0
  }

  receiveCard(card, hand = 0) {
    this.logger.log(`${this.name} is dealt ${card.face}`)
    this.hands[hand].takeCard(card)

    if(this.handValue(hand) > 21) {
      this.hands[hand].completeHand()
      this.logger.log(`${this.name} goes bust!`)
    }
  }

  adjustedHandValue(hand = 0) {
    if(this.getHandAmount() !== 1 && this.hasAPair(hand)) {
      return `hard ${this.handValue()}`
    } else {
      return this.hands[hand].trueValue()
    }
  }

  hasBlackJack(hand = 0) {
    return this.hands[hand].isBlackJack()
  }

  hasAPair(hand = 0) {
    return this.hands[hand].isAPair()
  }
}

module.exports = Player
