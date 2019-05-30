
class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hand = []
    this.splitHand = []
    this.chips = this.checkChips(chips)
    this.bet = 0
  }

  getChips() {
    return this.chips
  }

  checkChips(chips) {
    return (isNaN(chips) === true) ? 1000 : chips
  }

  receiveChips(amount) {
    this.chips += amount
  }

  placeBet(bet) {
    if(bet <= this.chips) {
      this.chips -= bet
      this.bet = bet
      return bet
    } else { 
      const chips = this.chips
      this.chips = 0
      this.bet = chips
      return chips
    }
  }

  handSize(handNumber) {
    return (handNumber !== 2) ? this.hand.length : this.splitHand.length
  }

  splitCards() {
    if(this.hand[0].value === this.hand[1].value) {
      this.splitHand = this.hand.splice(0,1)
    }
  }

  handValue(hand) {
    const handNumber = (hand === 2) ? this.splitHand : this.hand
      return handNumber.sort((a, b) => a.value - b.value).reduce((total, card) => {
        if(card.face.includes('A') && total + card.value > 21) {
          return total + 1
        }
        return total + card.value
      }, 0)
  }

  receiveCard(card) {
    this.hand.unshift(card)     
  }

  receiveCards(cards) {
    cards.forEach((card) => {
      this.hand.push(card)
    })    
  }

  removeCard(cardPos) {
    return this.hand.splice(cardPos-1,1)[0]
  }
}

module.exports = Player
