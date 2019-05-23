class Dealer {
  constructor () {
    this.name = 'Dealer'
    this.hand = []
    this.chips = 1000000
  }

  drawCard(deck) {
    this.hand.unshift(deck.dealCard())     
  }

  removeCard(cardPos) {
    return this.hand.splice(cardPos-1,1)[0]
  }
}

module.exports = Dealer
