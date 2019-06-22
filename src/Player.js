const Hand = require('./Hand')

class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hands = [new Hand()]
    this.chips = chips
    this.bets = []
  }

  getHandResult () {
    return this.hands[0].getResult()
  }

  getSecondHandResult () {
    return this.hands[1].getResult()
  }

  getBets() {
    return this.bets
  }

  removeBet() {
    return this.bets.pop()
  }

  getChips() {
    return this.chips
  }

  getName() {
    return this.name
  }

  receiveChips(amount) {
    this.chips += amount
  }

  placeBet(bet) {  
    if(bet > 0 && bet <= this.chips) {
      this.chips -= bet
      this.bets.push(bet)
    } else if(bet > this.chips) {
      const chips = this.chips
      this.bets.push(chips)
      this.chips = 0
    } 
  }

  showHand(handNumber = 1) {
    return this.hands[handNumber-1].showCards()
  }

  splitHand(handNumber = 1) {
    const hand = this.hands[handNumber-1]

    if(hand.isSplittable() && this.chips >= this.bets[0]) {
      const newHands = hand.split()
      this.hands[handNumber-1] = newHands[0]
      this.hands.push(newHands[1])
      this.placeBet(this.bets[0])
    }
  }

  discardHands() {
    this.hands = [new Hand()]
  }

  receiveCard(card, handNumber = 1) {
    this.hands[handNumber-1].takeCard(card)     
  }

  removeCard(cardPos, handNumber = 1) {
    return this.hands[handNumber-1].getCard(cardPos-1)
  }  
}

module.exports = Player
