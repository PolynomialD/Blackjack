const Hand = require('./Hand')

class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hands = [new Hand()]
    this.chips = this.checkChips(chips)
    this.bet = []
  }

  getChips() {
    return this.chips
  }

  checkChips(chips) {
    return (isNaN(chips) === true) ? 1000 : chips
  }

  receiveChips(amount) {
    this.chips += amount
  }

  placeBet(bet) {
    if(bet <= this.chips) {
      this.chips -= bet
      this.bet.push(bet)
      return bet
    } else { 
        const chips = this.chips
        this.chips = 0
        this.bet.push(chips)
        return chips
      }
  }

  showHand(handNumber = 0) {
    return this.hands[handNumber].showCards()
  }

  splitHand(handNumber = 0) {
    const hand = this.hands[handNumber]

    if(hand.isSplittable()) {
      this.hands = hand.split() 
    }
  }

  receiveCard(card, handNumber = 0) {
    this.hands[handNumber].takeCard(card)     
  }

  removeCard(cardPos, handNumber = 0) {
    return this.hands[handNumber].getCard(cardPos-1)
  }
}

module.exports = Player
