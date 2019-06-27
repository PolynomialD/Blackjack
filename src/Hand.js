class Hand {
  constructor (cards) {
    this.cards = cards || [],
    this.result = ''
    this.state = ''
  }
  
  getState() {
    return this.state
  }

  setState(state) {
    this.state = state
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
}

module.exports = Hand
