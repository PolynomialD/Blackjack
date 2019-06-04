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

  showHand(handNumber = 1) {
    return this.hands[handNumber-1].showCards()
  }

  splitHand(handNumber = 1) {
    const hand = this.hands[handNumber-1]

    if(hand.isSplittable()) {
      this.hands = hand.split() 
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
