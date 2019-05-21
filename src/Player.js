class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.cards = []
    this.checkChips(chips)
  }

  checkChips() {
    (isNaN(this.chips) === true) ? this.chips = 0 : this.chips = chips
  }

  takeCards(amount, deck) {
    for(amount; amount>0; amount--) {
      this.cards.unshift(deck.dealCard())     
    }
  }

  discardCard(cardPos) {
    return this.cards.splice(cardPos-1,1)[0]
  }
}

module.exports = Player
