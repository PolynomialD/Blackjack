class Deck {
  constructor(suits, values) {
    this.suits = suits || ['♠', '♣', '♥', '♦']
    this.values = values || [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
    this.cards = this.buildCards()
  }

  buildCards () {
    const cards = this.suits.map((suit) => {
      return this.values.map((value) => {
        return {
          'suit': suit,
          'value': value
        }
      })      
    })
    return [].concat.apply([], cards)
  }

  size () {
    return this.cards.length
  }

  cut (placeToCut) {
    this.cards = [...this.cards.slice(placeToCut, this.cards.length), ...this.cards.slice(0, placeToCut)]
  }

  dealCard () {
    return this.cards.shift()
  }

  shuffle () {
    this.cards = this.recursiveShuffle(this.cards)
  }

  recursiveShuffle (deck, i = 1, limit = 20) {
    const clone = deck.slice(0)

    const newDeck = new Array(clone.length).fill(0).map(() => {
        return clone.splice(Math.floor(Math.random() * Math.floor(limit)),1)[0]
    })  
    return (i < limit) ? this.recursiveShuffle(newDeck, ++i) : newDeck
  }
}

module.exports = Deck
