const Hand = require('./Hand')

class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hands = [new Hand()]
    this.chips = chips
    this.bets = []
    this.insuranceBet = 0
  }

  stick(hand) {
    this.hands[hand].setState('complete')
  }

  getStatus() {
    if(this.getHandAmount() === 1 && this.hands[0].getState() === 'complete') {
      return 'done'
    } else if(this.getHandAmount() === 2) {
      if(this.hands[0].getState() === 'complete' && this.hands[1].getState() === 'complete') {
        return 'done'
      }
    } else return 'playing'
  }

  getHandResult(hand) {
    return this.hands[hand].getResult()
  }

  getBets() {
    return this.bets
  }

  getInsuranceBet() {
    return this.insuranceBet
  }

  removeBet() {
    return this.bets.pop()
  }

  removeInsuranceBet() {
    const bet = this.insuranceBet
    this.insuranceBet = 0
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
    this.chips += amount
  }

  placeBet(bet) {  
    const chips = this.chips
    if(bet > 0 && bet <= chips) {
      this.chips -= bet
      this.bets.push(bet)
    } else if(bet > chips) {
      this.bets.push(chips)
      this.chips = 0
    } 
  }

  placeInsuranceBet() {
    const chips = this.chips
    const halfBet = this.bets[0]/2
    if(chips > halfBet) {
      this.chips -= halfBet
      this.insuranceBet = halfBet
    }
  }

  showHand(handNumber = 0) {
    return this.hands[handNumber].showCards()
  }

  showHands() {
    if(this.getHandAmount() === 2) {
      return [this.hands[0].showCards(),this.hands[1].showCards()]
    } else {
      return [this.hands[0].showCards()]
    }
  }

  splitHand() {
    const hand = this.hands[0]

    if(hand.isSplittable() && this.chips >= this.bets[0]) {
      const newHands = hand.split()
      this.hands[0] = newHands[0]
      this.hands.push(newHands[1])
      this.placeBet(this.bets[0])
    }
  }

  discardHands() {
    this.hands = [new Hand()]
  }

  receiveCard(card, handNumber=0) {
    this.hands[handNumber].takeCard(card)
  }

  removeCard(cardPos, handNumber=0) {
    return this.hands[handNumber].getCard(cardPos-1)
  }  
}

module.exports = Player
