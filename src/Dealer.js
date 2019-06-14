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
    return this.hand.size()
  }

  showHand() {
    return this.hand.showCards()
  }

  discardHand() {
    this.hand = new Hand()
  }

  giveChips(amount) {
    this.chips -= amount
    return amount
  }

  receiveChips(amount) {
    this.chips += amount
  }
}

module.exports = Dealer
