class Dealer {
  constructor () {
    this.name = 'Dealer'
    this.hand = []
    this.chips = 1000000
  }

  receiveCard(card) {
    this.hand.unshift(card)
  }

  removeCard(cardPos) {
    return this.hand.splice(cardPos-1,1)[0]
  }

  handSize() {
    return this.hand.length
  }
}

module.exports = Dealer
