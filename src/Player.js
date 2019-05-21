class Player {
  constructor (name) {
    this.name = name.toString()
    this.cards = []
  }

  takeCards(amount, deck) {
    const playerCards = this.cards
    for(amount; amount>0; amount--) {
      playerCards.unshift(deck.dealCard())
      console.log(playerCards)
      this.cards = playerCards
    }
  }
}

module.exports = Player
