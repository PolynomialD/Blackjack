
class Player {
  constructor (name, chips) {
    this.name = name.toString()
    this.hand = [[]]
    this.chips = this.checkChips(chips)
    this.bet = []
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
      this.bet.push(bet)
      return bet
    } else { 
      const chips = this.chips
      this.chips = 0
      this.bet.push(chips)
      return chips
    }
  }

  handSize(handNumber = 1) {
    return this.hand[handNumber-1].length
  }

  splitCards() {
    if(this.hand[0][0].value === this.hand[0][1].value) {
      this.hand.push([this.hand[0].splice(0,1)[0]])
      this.bet.push(this.bet[0])
    }
  }

  handValue(handNumber = 1) {
      return this.hand[handNumber-1].sort((a, b) => a.value - b.value).reduce((total, card) => {
        if(card.face.includes('A') && total + card.value > 21) {
          return total + 1
        }
        return total + card.value
      }, 0)
  }

  receiveCard(card, handNumber = 1) {
    this.hand[handNumber-1].unshift(card)     
  }

  receiveCards(cards, handNumber = 1) {
    cards.forEach((card) => {
      this.hand[handNumber-1].push(card)
    })    
  }

  removeCard(cardPos, handNumber = 1) {
    return this.hand[handNumber-1].splice(cardPos-1,1)[0]
  }
}

module.exports = Player
