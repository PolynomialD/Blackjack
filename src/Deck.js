class Deck {
  constructor(suits, values) {
    this.suits = suits || ['♣', '♦', '♥', '♠']
    this.values = values || [
      ['2', 2],['3',3],['4', 4],['5', 5],['6', 6],['7', 1],['8', 8],['9', 9],['10', 10],['J', 10],['Q', 10],['K', 10],['A', 11]
    ]
    this.cards = this.buildCards()
  }

  buildCards () {
    const cards = this.suits.map((suit) => {
      return this.values.map((value) => {
        return {
          'suit': suit,
          'face': suit+`${value[0]}`,
          'value': value[1]
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

  dealCards (amount) {
    const cardsToDeal = []
    for(amount; amount>0; amount--) {
      cardsToDeal.push(this.cards.shift())
    }
    return cardsToDeal
  }

  shuffle () {
    this.cards = this.recursiveShuffle(this.cards)
  }

  recursiveShuffle (deck, i = 1, limit = 200) {
    const clone = deck.slice(0)

    const newDeck = new Array(clone.length).fill(0).map(() => {
        return clone.splice(Math.floor(Math.random() * Math.floor(clone.length)),1)[0]
    })  
    return (i < limit) ? this.recursiveShuffle(newDeck, ++i) : newDeck
  }

  // sort() {
  //   this.cards.sort(function(a, b){return a.value - b.value})
  // }

}

module.exports = Deck
