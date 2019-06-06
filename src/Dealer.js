const Hand = require('./Hand')

class Dealer {
  constructor () {
    this.name = 'Dealer'
    this.hand = new Hand()
    this.chips = 1000000
  }

  receiveCard(card) {
    this.hand.takeCard(card)
  }

  removeCard(index) {
    return this.hand.getCard(index)
  }

  handSize() {
    return this.hand.length
  }

  giveChips(amount) {
    this.chips -= amount
    return amount
  }
  
  playHand() {
    return 0
  }
}

module.exports = Dealer
