const Deck = require('./Deck')
const Dealer = require('./Dealer')
const Table = require('./Table')

class BlackJackGame {
  constructor () {
    this.deck = new Deck()
    this.dealer = new Dealer()
    this.table = new Table()
    this.players = this.table.players
  }

  dealCards() {
    for(let i in this.players) {
      this.players[i].hand.push(this.deck.dealCard(),this.deck.dealCard())
      // console.log(this.players[i].hand)
    }
    this.dealer.hand.push(this.deck.dealCard(),this.deck.dealCard()) 
    // console.log(this.dealer.hand)
  }
  dealerHandValue() {
    const hand = this.dealer.hand
    // console.log('dealer hand: ', hand, 'hand value: ', this.handValue(hand))
    return this.handValue(hand)
  }

  playerHandValue(player) {
    const hand = this.players[player-1].hand
    // console.log(`player${player} hand: `, hand, 'hand value: ', this.handValue(hand))
    return this.handValue(hand)
  }

  handValue(hand) { 
    let array = this.createArray(hand)
    return this.arrayValue(array)
  }
  
  arrayValue(array) {
    return (this.total(array) <= 21) ? this.total(array) : 
      (this.sort(array)[array.length-1] < 11) ? this.total(array) : this.arrayValue(this.changeAce(array))
  }

  
  createArray(hand) {
    const array = []
    for(let card in hand) {
      switch(hand[card].value) {
        case 'A': array.push(11)
        break
        case 'J': array.push(10)
        break
        case 'Q': array.push(10)
        break
        case 'K': array.push(10)
        break
        default: array.push(hand[card].value)
      }
    }
    return this.sort(array)
  }

  changeAce(array) {
      array[array.length-1] = 1
      return array
  }

  sort(array) {
    return array.sort((a, b) => a - b)
  }

  total(array) {
    return array.reduce((a, b) => a + b)
  }
  
}

module.exports = BlackJackGame
