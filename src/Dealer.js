const Hand = require('./Hand')

class Dealer {
  constructor () {
    this.name = 'Dealer'
    this.hand = new Hand()
    this.chips = 1000000
  }

  hasBlackJack() {
    if(this.hand.cards[1].value === 11 && this.hand.cards[0].value === 10 && this.handSize() === 2) {
      return true
    } else if(this.hand.cards[1].value === 10 && this.hand.cards[0].value === 11 && this.handSize() === 2) {
      return true
    } else return false
  }

  showsAnAce() {
    return (this.hand.cards[1].value === 11) ? true : false
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
