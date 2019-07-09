const Hand = require('./Hand')
const Player = require('./Player')

class Dealer extends Player {
  constructor (logger = () => undefined) {
    super('Dealer', 1000000, logger)
  }

  showsAnAce() {
    return this.hands[0].cards[1].value === 11
  }

  receiveCard(card) {
    this.hands[0].takeCard(card)
  }

  removeCard(index) {
    return this.hands[0].getCard(index)
  }

  showHand() {
    return this.hands[0].showCards()
  }

  discardHand() {
    this.hands = [new Hand()]
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
