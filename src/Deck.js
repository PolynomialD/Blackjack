class Deck {
  constructor(suits, values) {
    this.suits = suits || ['♣', '♦', '♥', '♠']
    this.values = values || [
      ['2', 2],['3',3],['4', 4],['5', 5],['6', 6],['7', 7],['8', 8],['9', 9],['10', 10],['J', 10],['Q', 10],['K', 10],['A', 11]
    ]
    this.cards = this.buildCards()
    this.dealtCards = []
    this.cardColour = 0
    this.colours = ['red', 'blue', 'black', 'green', 'orange', 'purple']
    this.cardBackPath = `../assets/cards/card_back_${this.colours[this.cardColour]}.png`
  }

  buildCards () {
    const cards = this.suits.map((suit) => {
      return this.values.map((value) => {
        let suitString
        let valueString

        switch(suit) {
          case '♣': suitString = 'clubs'
          case '♦': suitString = 'diamonds'
          case '♥': suitString = 'spades'
          case '♠': suitString = 'spades'
        }
        switch(value[0]) {
          case 'J': valueString = 'jack'
          case 'Q': valueString = 'queen'
          case 'K': valueString = 'king'
          case 'A': valueString = 'ace'
          default: valueString = value[1]
        }
        return {
          'suit': suit,
          'face': suit+`${value[0]}`,
          'value': value[1],
          'image': `../assets/cards/${valueString}_of_${suitString}.png`
        }
      })      
    })
    return [].concat.apply([], cards)
  }

  changeCardColour() {
    this.cardColour = (this.cardColour === this.colours.length-1) ? 0 : this.cardColour + 1
    this.cardBackPath = `../assets/cards/card_back_${this.colours[this.cardColour]}.png`
  }

  getCardBackPath() {
    return this.cardBackPath
  }

  size () {
    return this.cards.length
  }

  cut (placeToCut) {
    this.cards = [...this.cards.slice(placeToCut, this.cards.length), ...this.cards.slice(0, placeToCut)]
  }

  dealCard () {
    this.dealtCards.push(this.cards[0])
    return this.cards.shift()
  }

  dealCards (amount) {
    const cardsToDeal = []
    for(amount; amount>0; amount--) {
      this.dealtCards.push(this.cards[0])
      cardsToDeal.push(this.cards.shift())
    }
    return cardsToDeal
  }

  showDealtCards() {
    return this.dealtCards
  }

  dealtCardsSize() {
    return this.dealtCards.length
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
}

module.exports = Deck
