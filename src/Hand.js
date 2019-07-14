class Hand {
  constructor (cards) {
    this.cards = cards || [],
    this.result = ''
    this.complete = false
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
    const clone = JSON.parse(JSON.stringify(this.cards))
    const sortedClone = clone.sort((a, b) => a.value - b.value)
    const cloneValue = sortedClone.reduce((total) => {
      return total + card.value
    })

    if(this.size === 2 && clone[0].value === clone[1].value) {
      return `pair of ${clone[0].value}'s`
    } else if(sortedClone[sortedClone.length-1].value = 11 && cloneValue <= 21) {
      return `soft ${cloneValue}`
    } else {
      return `hard ${this.value}`
    }
  }
}

module.exports = Hand
