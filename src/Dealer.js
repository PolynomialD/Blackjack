const Hand = require('./Hand')
const Player = require('./Player')

class Dealer extends Player {
  constructor (logger = () => undefined) {
    super('Dealer', 1000000, logger)
    this.hand = [new Hand()]
  }

  hasBlackJack() {
    return this.hand[0].value() === 21 && this.handSize() === 2
  }

  showsAnAce() {
    return this.hand[0].cards[1].value === 11
  }

  receiveCard(card) {
    this.hand[0].takeCard(card)
  }

  removeCard(index) {
    return this.hand[0].getCard(index)
  }

  handSize() {
    return this.hand.size()
  }

  showHand() {
    return this.hand[0].showCards()
  }

  discardHand() {
    this.hand = [new Hand()]
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
