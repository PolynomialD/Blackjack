class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hand = []
    this.chips = this.checkChips(chips)
  }

  checkChips(chips) {
    return (isNaN(chips) === true) ? 1000 : chips
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
