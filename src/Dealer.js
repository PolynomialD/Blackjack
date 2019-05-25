class Dealer {
  constructor () {
    this.name = 'Dealer'
    this.hand = []
    this.chips = 1000000
  }

  recieveCard(card) {
    this.hand.unshift(card)
  }

  removeCard(cardPos) {
    return this.hand.splice(cardPos-1,1)[0]
  }

  handSize() {
    return 2
  }
}

module.exports = Dealer
