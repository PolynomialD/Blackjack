class Hand {
  constructor (cards) {
    this.cards = cards || [],
    this.result = ''
    this.complete = false
  }

  isBlackJack() {
    return this.size() === 2 && this.value() === 21
  }

  isAPair() {
    return this.size() === 2 && this.cards[0].value === this.cards[1].value
  }
  
  isComplete() {
    return this.complete
  }

  completeHand() {
    this.complete = true
  }

  setResult(result) {
    this.result = result
  }

  getResult() {
    return this.result
  }

  takeCard(card) {
    this.cards.push(card)
  }

  showCards() {
    return this.cards
  }

  size() {
    return this.cards.length
  }

  getCard(index) {
    return this.cards.splice(index,1)[0]
  }

  isSplittable () {
    if (this.cards.length !== 2) return false
    return this.cards[0].value === this.cards[1].value
  }

  split() {
    return this.isSplittable() ? [
      new Hand([this.cards[0]]),
      new Hand([this.cards[1]])
    ] : undefined
  }

  value() {
    const clone = JSON.parse(JSON.stringify(this.cards))
    return clone.sort((a, b) => a.value - b.value).reduce((total, card) => {
      if(card.value === 11 && total + card.value > 21) {
        return total + 1
      }
      return total + card.value
    }, 0)
  }

  trueValue() {
    const sortedClone = JSON.parse(JSON.stringify(this.cards)).sort((a, b) => a.value - b.value)
    const cloneRawValue = sortedClone.reduce((total, card) => {
      return total + card.value
    }, 0)

    if(this.isBlackJack()) {
      return 'blackjack'
    } else if(this.isAPair()) {
      return `pair of ${this.cards[0].value}'s`
    } else if(sortedClone[sortedClone.length-1].value === 11 && cloneRawValue <= 21) {
      return `soft ${cloneRawValue}`
    } else {
      return `hard ${this.value()}`
    }
  }
}

module.exports = Hand
