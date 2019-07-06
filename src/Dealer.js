const Hand = require('./Hand')
const Player = require('./Player')

class Dealer extends Player {
  constructor (logger = () => undefined) {
    super('Dealer', 1000000, logger)
    this.hand = new Hand()
  }

  hasBlackJack() {
    return this.hand.value() === 21 && this.handSize() === 2
  }

  showsAnAce() {
    return this.hand.cards[1].value === 11
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
