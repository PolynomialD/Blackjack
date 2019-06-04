const Hand = require('./Hand')

class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hands = [new Hand()]
    this.chips = chips
    this.bet = []
  }

  getChips() {
    return this.chips
  }

  receiveChips(amount) {
    this.chips += amount
  }

  placeBet(bet) {  
    if(bet > 0 && bet <= this.chips) {
      this.chips -= bet
      this.bet.push(bet)
      return bet
    } else if(bet > this.chips) { 
        const chips = this.chips
        this.chips = 0
        this.bet.push(chips)
        return chips
      } else return 0
  }

  showHand(handNumber = 1) {
    return this.hands[handNumber-1].showCards()
  }

  splitHand(handNumber = 1) {
    const hand = this.hands[handNumber-1]

    if(hand.isSplittable() && this.getChips() > 0) {
      const newHands = hand.split()
      this.hands[handNumber-1] = newHands[0]
      this.hands.push(newHands[1])
      this.placeBet(this.bet[0])
    }
  }

  receiveCard(card, handNumber = 1) {
    this.hands[handNumber-1].takeCard(card)     
  }

  removeCard(cardPos, handNumber = 1) {
    return this.hands[handNumber-1].getCard(cardPos-1)
  }
}

module.exports = Player
