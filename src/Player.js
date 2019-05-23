class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hand = []
    this.checkChips(chips)
  }

  checkChips(chips) {
    (isNaN(chips) === true) ? this.chips = 1000 : this.chips = chips
  }

  placeBet(bet) {
    if(bet <= this.chips) {
      this.chips -= bet
      return bet
    } else { 
      const chips = this.chips
      this.chips = 0
      return chips
    }
  }

  drawCard(deck) {
    this.hand.unshift(deck.dealCard())     
  }

  removeCard(cardPos) {
    return this.hand.splice(cardPos-1,1)[0]
  }
}

module.exports = Player
